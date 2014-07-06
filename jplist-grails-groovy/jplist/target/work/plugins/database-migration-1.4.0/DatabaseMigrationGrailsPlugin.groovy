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

import grails.plugin.databasemigration.GormDatabaseSnapshotGenerator
import grails.plugin.databasemigration.GormDatabaseTypeConverter
import grails.plugin.databasemigration.GrailsChange
import grails.plugin.databasemigration.GrailsChangeLogParser
import grails.plugin.databasemigration.GrailsClassLoaderResourceAccessor
import grails.plugin.databasemigration.GrailsDiffStatusListener
import grails.plugin.databasemigration.GrailsPrecondition
import grails.plugin.databasemigration.MigrationRunner
import grails.plugin.databasemigration.MigrationUtils
import grails.plugin.databasemigration.MysqlAwareCreateTableGenerator
import grails.plugin.databasemigration.Slf4jLogger
import liquibase.change.ChangeFactory
import liquibase.database.typeconversion.TypeConverterFactory
import liquibase.logging.LogFactory
import liquibase.logging.Logger
import liquibase.parser.ChangeLogParserFactory
import liquibase.precondition.PreconditionFactory
import liquibase.resource.ClassLoaderResourceAccessor
import liquibase.resource.CompositeResourceAccessor
import liquibase.resource.FileSystemResourceAccessor
import liquibase.resource.ResourceAccessor
import liquibase.servicelocator.ServiceLocator
import liquibase.snapshot.DatabaseSnapshotGeneratorFactory
import liquibase.sqlgenerator.SqlGeneratorFactory
import liquibase.sqlgenerator.core.CreateTableGenerator

class DatabaseMigrationGrailsPlugin {

	String grailsVersion = '2.3.0 > *'
	String version = '1.4.0'
	String author = 'Burt Beckwith'
	String authorEmail = 'burt@burtbeckwith.com'
	String title = 'Grails Database Migration Plugin'
	String description = 'Grails Database Migration Plugin'
	String documentation = 'http://grails-plugins.github.io/grails-database-migration/'

	List pluginExcludes = [
		'grails-app/domain/**',
		'docs/**',
		'src/docs/**',
		'src/groovy/grails/plugin/databasemigration/test/**'
	]

	String license = 'APACHE'
	def organization = [name: 'Pivotal', url: 'http://www.gopivotal.com/oss']
	def issueManagement = [system: 'JIRA', url: 'http://jira.grails.org/browse/GPDATABASEMIGRATION']
	def scm = [url: 'https://github.com/grails-plugins/grails-database-migration']

	def doWithSpring = {

		MigrationUtils.application = application

		ResourceAccessor classLoaderResourceAccessor = new ClassLoaderResourceAccessor()

		if (application.warDeployed) {
			migrationResourceAccessor(CompositeResourceAccessor, [new GrailsClassLoaderResourceAccessor(), classLoaderResourceAccessor])
		}
		else {
			String changelogLocation = MigrationUtils.changelogLocation
			String changelogLocationPath = new File(changelogLocation).path
			migrationResourceAccessor(CompositeResourceAccessor, [new FileSystemResourceAccessor(changelogLocationPath), classLoaderResourceAccessor])
		}

		diffStatusListener(GrailsDiffStatusListener)
	}

	def doWithApplicationContext = { ctx ->

		def conf = ctx.grailsApplication.config.grails.plugin.databasemigration
		if (conf.databaseChangeLogTableName) {
			System.setProperty 'liquibase.databaseChangeLogTableName', conf.databaseChangeLogTableName
		}
		if (conf.databaseChangeLogLockTableName) {
			System.setProperty 'liquibase.databaseChangeLogLockTableName', conf.databaseChangeLogLockTableName
		}

		register ctx

		fixLogging()

		MigrationRunner.autoRun ctx.migrationCallbacks
	}

	private void register(ctx) {
		// adds support for .groovy extension
		ChangeLogParserFactory.instance.register new GrailsChangeLogParser(ctx)

		// adds support for Groovy-based changes in DSL changelogs
		ChangeFactory.instance.register GrailsChange

		// adds support for Groovy-based preconditions in DSL changelogs
		PreconditionFactory.instance.register GrailsPrecondition

		// appends 'ENGINE=InnoDB' to 'create table ...' statements in MySQL if using InnoDB
		SqlGeneratorFactory.instance.unregister CreateTableGenerator
		SqlGeneratorFactory.instance.register new MysqlAwareCreateTableGenerator()

		if (MigrationUtils.hibernateAvailable()) {
			registerHibernate ctx
		}
	}

	private void registerHibernate(ctx) {

		// used by gorm-diff and generate-gorm-changelog
		DatabaseSnapshotGeneratorFactory.instance.register new GormDatabaseSnapshotGenerator()

		// fixes changelog errors generated from the GORM scripts
		TypeConverterFactory.instance.register GormDatabaseTypeConverter
	}

	private void fixLogging() {
		// ensure that classesBySuperclass is populated
		LogFactory.getLogger 'NOT_A_REAL_LOGGER_NAME'

		try {
			// register the plugin's logger
			ServiceLocator.instance.classesBySuperclass[Logger] << Slf4jLogger
		}
		catch (Throwable t) {
			// ignored, fall back to default logging
		}
	}
}
