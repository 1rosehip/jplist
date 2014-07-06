/* Copyright 2010-2013 SpringSource.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package grails.plugin.databasemigration

import java.sql.Connection

import liquibase.Liquibase
import liquibase.database.Database
import liquibase.database.DatabaseFactory
import liquibase.database.jvm.JdbcConnection
import liquibase.database.structure.Index
import liquibase.database.structure.UniqueConstraint
import liquibase.diff.DiffResult

import org.codehaus.groovy.grails.commons.GrailsApplication
import org.codehaus.groovy.grails.support.PersistenceContextInterceptorExecutor
import org.springframework.transaction.support.TransactionSynchronizationManager

/**
 * @author <a href='mailto:burt@burtbeckwith.com'>Burt Beckwith</a>
 */
class MigrationUtils {

	protected MigrationUtils() {
		// static only
	}

	/** Set at startup. */
	static GrailsApplication application

	/** Set from _Events.groovy in eventPackageAppEnd. */
	static String scriptName

	static Database getDatabase(Connection connection, String defaultSchema, String dialectName) {
		def database = DatabaseFactory.instance.findCorrectDatabaseImplementation(
			new JdbcConnection(connection))

		if (defaultSchema) {
			database.defaultSchemaName = defaultSchema
		}
//		database.defaultSchemaName = connection.catalog // TODO

		if (dialectName) {
			// add in a per-instance getDialect() method, mostly needed in
			// MysqlAwareCreateTableGenerator for MySQL InnoDB
			def dialect = createInstance(dialectName)
			def emc = new ExpandoMetaClass(database.getClass(), false)
			emc.getDialect = { -> dialect }
			emc.initialize()
			database.metaClass = emc
		}

		database
	}

	static Map<String, Database> getDatabases() {
		Map<String, Database> databaseMap = [:]

		databaseMap.dataSource = getDatabase(getConfig().updateOnStartDefaultSchema ?: null)

		getDataSourceConfigs().each { String dsName, dsConfig ->
			String dataSourceSuffix = extractSuffix(dsName)
			def connection = findSessionFactory(dataSourceSuffix).currentSession.connection()

			def dialect = application.config."dataSource$dataSourceSuffix".dialect
			if (dialect && dialect instanceof Class) {
				dialect = dialect.name
			}
			else {
				dialect = application.mainContext.dialectDetector
			}

			String defaultSchema = config."$dsName".updateOnStartDefaultSchema ?: null
			databaseMap[dsName] == getDatabase(connection, defaultSchema, dialect.toString())
		}

		databaseMap
	}

	static Map<String, ConfigObject> getDataSourceConfigs() {
		def dsConfigs = [:]
		application.config.each { String name, value ->
			if (name.startsWith('dataSource_') && value instanceof ConfigObject) {
				dsConfigs[name] = value
			}
		}

		dsConfigs
	}

	static Database getDatabase(String defaultSchema = null, String dsName = 'dataSource') {
		String dataSourceSuffix = extractSuffix(dsName)
		def connection = findSessionFactory(dataSourceSuffix).currentSession.connection()

		def dialect = application.config."$dsName".dialect
		if (dialect) {
			if (dialect instanceof Class) {
				dialect = dialect.name
			}
		}
		else {
			dialect = application.mainContext.dialectDetector
		}

		getDatabase connection, defaultSchema, dialect.toString()
	}

	static Liquibase getLiquibase(Database database) {
		getLiquibase database, getChangelogFileName()
	}

	static Liquibase getLiquibase(Database database, String changelogFileName) {
		def resourceAccessor = application.mainContext.migrationResourceAccessor
		new Liquibase(changelogFileName, resourceAccessor, database)
	}

	static void executeInSession(String dsName = 'dataSource', Closure c) {
		def appCtx = application.mainContext
		PersistenceContextInterceptorExecutor.initPersistenceContext(appCtx)
		try {
			c()
		}
		finally {
			PersistenceContextInterceptorExecutor.destroyPersistenceContext(appCtx)
		}
	}

	protected static findSessionFactory(String dataSourceSuffix = '') {

		def factoryBean = application.mainContext.getBean('&sessionFactory' + dataSourceSuffix)
		if (factoryBean.getClass().simpleName == 'DelayedSessionFactoryBean') {
			// get the un-proxied version since at this point it's ok to get a connection;
			// only an issue during plugin tests
			return factoryBean.realSessionFactory
		}

		application.mainContext."sessionFactory$dataSourceSuffix"
	}

	protected static extractSuffix(String dataSourceName) {
		dataSourceName == 'dataSource' ? '' : dataSourceName[10..-1]
	}

	static String dataSourceNameWithSuffix(String dataSourceSuffix = '') {
		dataSourceSuffix ? 'dataSource_' + dataSourceSuffix : 'dataSource'
	}

	protected static extractSuffixWithOutUnderbar(dataSourceName) {
		dataSourceName == 'dataSource' ? '' : dataSourceName[11..-1]
	}

	static boolean canAutoMigrate(String dsName = 'dataSource') {

		// in a war
		if (application.warDeployed || getConfig()?.forceAutoMigrate) {
			return true
		}

		if (Boolean.getBoolean('grails.fork.active') && !scriptName) {
			// scriptName gets set in the initial JVM and not this one,
			// so infer that it's run-app based on being in forked mode
			scriptName = 'RunApp'
		}

		if (!scriptName) {
			// not run-app, so it won't make sense to auto-migrate
			return
		}

		// in run-app
		if (getAutoMigrateScripts(dsName).contains(scriptName)) {
			return true
		}

		false
	}

	static createInstance(String className) {
		application.classLoader.loadClass(className).newInstance()
	}

	static ConfigObject getConfig(String dsName = 'dataSource') {
		boolean isDefault = dsName == 'dataSource'
		if (isDefault) {
			return application.config.grails.plugin.databasemigration
		}

		String dataSourceSuffix = extractSuffixWithOutUnderbar(dsName)
		return application.config.grails.plugin.databasemigration."$dataSourceSuffix"
	}

	static String getDbDocLocation(String dsName = 'dataSource') {
		getConfig(dsName).dbDocLocation ?: 'target/dbdoc'
	}

	static String getAutoMigrateScripts(String dsName = 'dataSource') {
		getConfig(dsName).autoMigrateScripts ?: ['RunApp']
	}

	static String getChangelogFileName(String dsName = 'dataSource') {
		boolean isDefault = dsName == 'dataSource'
		if (isDefault) {
			return getConfig().changelogFileName ?: 'changelog.groovy'
		}

		String dataSourceSuffix = extractSuffixWithOutUnderbar(dsName)
		return getConfig(dsName).changelogFileName ?: "changelog-${dataSourceSuffix}.groovy"
	}

	static String getChangelogLocation(String dsName = 'dataSource') {
		getConfig(dsName).changelogLocation ?: 'grails-app/migrations'
	}

	static ConfigObject getChangelogProperties(String dsName = 'dataSource') {
		getConfig(dsName).changelogProperties ?: [:]
	}

	static DiffResult fixDiffResult(DiffResult diffResult) {
		removeRedundantUnexpectedUnique diffResult
		removeEquivalentIndexes diffResult
		removeIgnoredObjects diffResult

		for (Iterator iter = diffResult.unexpectedIndexes.iterator(); iter.hasNext(); ) {
			Index index = iter.next()
			if (index.associatedWith.contains(Index.MARK_PRIMARY_KEY) ||
					index.associatedWith.contains(Index.MARK_FOREIGN_KEY) ||
					index.associatedWith.contains(Index.MARK_UNIQUE_CONSTRAINT)) {
				continue
			}

			for (Index targetIndex in diffResult.referenceSnapshot.indexes) {
				if (index.columns.size() == targetIndex.columns.size() &&
						index.columns.containsAll(targetIndex.columns) &&
						index.table.name.equalsIgnoreCase(targetIndex.table.name) &&
						index.unique == targetIndex.unique) {
					iter.remove()
					break
				}
			}
		}

		diffResult
	}

	static void removeRedundantUnexpectedUnique(DiffResult diffResult) {
		for (Iterator iter = diffResult.unexpectedUniqueConstraints.iterator(); iter.hasNext(); ) {
			UniqueConstraint uniqueConstraint = iter.next()
			List<String> constraintColumnNames = uniqueConstraint.columns*.toLowerCase()
			for (Index index in diffResult.targetSnapshot.indexes) {
				List<String> indexColumnNames = index.columns*.toLowerCase()
				if (index.unique &&
						indexColumnNames.size() == constraintColumnNames.size() &&
						indexColumnNames.containsAll(constraintColumnNames) &&
						index.table.name.equalsIgnoreCase(uniqueConstraint.table.name)) {
					iter.remove()
					break
				}
			}
		}
	}

	static void removeEquivalentIndexes(DiffResult diffResult) {
		for (Iterator iter = diffResult.missingIndexes.iterator(); iter.hasNext(); ) {
			Index index = iter.next()
			List<String> indexColumnNames = index.columns*.toLowerCase()
			for (Iterator targetIter = diffResult.targetSnapshot.indexes.iterator(); targetIter.hasNext(); ) {
				Index targetIndex = targetIter.next()
				List<String> targetIndexColumnNames = targetIndex.columns*.toLowerCase()
				if (indexColumnNames.size() == targetIndexColumnNames.size() &&
						indexColumnNames.containsAll(targetIndexColumnNames) &&
						index.table.name.equalsIgnoreCase(targetIndex.table.name)) {
					iter.remove()
					targetIter.remove()
					diffResult.unexpectedIndexes.remove targetIndex
					break
				}
			}
		}
	}

	static void removeIgnoredObjects(DiffResult diffResult) {
		def ignoredObjects = application.config.grails.plugin.databasemigration.ignoredObjects
		if (!ignoredObjects) return

		diffResult.missingTables.removeAll(diffResult.missingTables.findAll { ignoredObjects.contains(it.name) })
		diffResult.missingPrimaryKeys.removeAll(diffResult.missingPrimaryKeys.findAll { ignoredObjects.contains(it.name) })

		// convenience to automatically ignore ignored tables' generated primary keys
		diffResult.missingPrimaryKeys.removeAll(diffResult.missingPrimaryKeys.findAll { ignoredObjects.contains(it.table.name) })

		// ignore missing foreign keys that are for ignored tables
		diffResult.missingForeignKeys.removeAll(diffResult.missingForeignKeys.findAll { ignoredObjects.contains(it.foreignKeyTable.name) })
		diffResult.unexpectedTables.removeAll(diffResult.unexpectedTables.findAll { ignoredObjects.contains(it.name) })
		diffResult.unexpectedViews.removeAll(diffResult.unexpectedViews.findAll { ignoredObjects.contains(it.name) })
		diffResult.unexpectedForeignKeys.removeAll(diffResult.unexpectedForeignKeys.findAll { ignoredObjects.contains(it.name) })

		// ignore unexpected foreign keys that are for ignored tables
		diffResult.unexpectedForeignKeys.removeAll(diffResult.unexpectedForeignKeys.findAll { ignoredObjects.contains(it.foreignKeyTable.name) })
		diffResult.unexpectedIndexes.removeAll(diffResult.unexpectedIndexes.findAll { ignoredObjects.contains(it.table.name) })
		diffResult.unexpectedIndexes.removeAll(diffResult.unexpectedIndexes.findAll { ignoredObjects.contains(it.name) })
		diffResult.unexpectedPrimaryKeys.removeAll(diffResult.unexpectedPrimaryKeys.findAll { ignoredObjects.contains(it.name) })

		// ignore unexpected primary keys that are for ignored tables
		diffResult.unexpectedPrimaryKeys.removeAll(diffResult.unexpectedPrimaryKeys.findAll { ignoredObjects.contains(it.table.name) })
		diffResult.unexpectedUniqueConstraints.removeAll(diffResult.unexpectedUniqueConstraints.findAll { ignoredObjects.contains(it.name) })
		diffResult.unexpectedSequences.removeAll(diffResult.unexpectedSequences.findAll { ignoredObjects.contains(it.name) })

		//list of regex expressions matching columns
		def ignoredColumns = application.config.grails.plugin.databasemigration.ignoredColumns ?: []
		if (ignoredColumns) {
			diffResult.unexpectedColumns.removeAll(diffResult.unexpectedColumns.findAll { column ->
				ignoredColumns.find { pattern -> "${column.table.name}.$column.name" ==~ pattern } != null
			})
		}

		diffResult.missingViews.removeAll(diffResult.missingViews.findAll { ignoredObjects.contains(it.name) })
	}

	static boolean hibernateAvailable() {
		null != classForName('org.hibernate.cfg.Configuration')
	}

	static Class<?> classForName(String name) {
		try {
			return Class.forName(name, false, Thread.currentThread().contextClassLoader)
		}
		catch (ClassNotFoundException e) {
			return null
		}
	}

	static boolean instanceOf(o, String className) {
		classForName(className).isAssignableFrom(o.getClass())
	}
}
