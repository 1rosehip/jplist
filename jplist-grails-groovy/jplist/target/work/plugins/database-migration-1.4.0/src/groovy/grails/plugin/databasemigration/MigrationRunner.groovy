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

import grails.util.GrailsUtil
import java.sql.ResultSet
import liquibase.Liquibase
import liquibase.database.Database

import org.slf4j.Logger
import org.slf4j.LoggerFactory

/**
 * Based on the class of the same name from Mike Hugo's liquibase-runner plugin.
 *
 * @author Mike Hugo
 * @author <a href='mailto:burt@burtbeckwith.com'>Burt Beckwith</a>
 */
class MigrationRunner {

	protected static Logger LOG = LoggerFactory.getLogger(this)

	static void autoRun(migrationCallbacks = null) {
		def dataSourceConfigs = grails.plugin.databasemigration.MigrationUtils.getDataSourceConfigs()
		dataSourceConfigs.dataSource = MigrationUtils.application.config.dataSource
		
		for (configAndName in dataSourceConfigs) {
			String dsConfigName = configAndName.key
			ConfigObject configObject = configAndName.value
			
			if (!MigrationUtils.canAutoMigrate(dsConfigName)) {
				LOG.warn "Not running auto migrate for DataSource '$dsConfigName'"
				continue
			}

			def config = MigrationUtils.getConfig(dsConfigName)

			if (!config.updateOnStart) {
				LOG.info "updateOnStart disabled for $dsConfigName; not running migrations"
				continue
			}

			try {
				MigrationUtils.executeInSession(dsConfigName) {
					Database database
					if(config.multiSchema){
						database = MigrationUtils.getDatabase(null, dsConfigName)
						ResultSet resultSet = database.connection.metaData.schemas
						List schemas = []
						while (resultSet.next()) {
							String schema = resultSet.getString(1)
							if(schema ==~ config.multiSchemaPattern || schema in config.multiSchemaList){ schemas << schema } 
						}
						
						LOG.info "Found ${schemas.size()} schemas to update"
						
						schemas.each{ schema ->
							database = MigrationUtils.getDatabase(schema, dsConfigName)
							runMigrations(dsConfigName, schema, config, database, migrationCallbacks)
						}
					}
					else{
						database = MigrationUtils.getDatabase(config.updateOnStartDefaultSchema ?: null, dsConfigName)
						runMigrations(dsConfigName, config.updateOnStartDefaultSchema ?: null, config, database, migrationCallbacks)
					}
				}
			}
			catch (e) {
				GrailsUtil.deepSanitize e
				throw e
			}
		}
	}
	
	static void runMigrations(dsConfigName, schema, config, database, migrationCallbacks){
		if (config.dropOnStart) {
			LOG.warn "Dropping tables..."
			MigrationUtils.getLiquibase(database).dropAll()
		}

		Map<String, Liquibase> liquibases = [:]
		for (String changelogName in config.updateOnStartFileNames) {
			Liquibase liquibase = MigrationUtils.getLiquibase(database, changelogName)
			if (liquibase.listUnrunChangeSets(config.updateOnStartContexts ?: config.contexts ?: null)) {
				liquibases[changelogName] = liquibase
			}
		}

		if (liquibases) {
			LOG.info "Migrations detected for '$dsConfigName${schema ? '.'+schema : ''}': ${liquibases.keySet()}"

			try {
				migrationCallbacks?.beforeStartMigration database
			}
			catch (MissingMethodException ignored) {}

			liquibases.each { String changelogName, Liquibase liquibase ->
				LOG.info "Running script '$changelogName'"

				try {
					migrationCallbacks?.onStartMigration database, liquibase, changelogName
				}
				catch (MissingMethodException ignored) {}

				liquibase.update config.updateOnStartContexts ?: config.contexts ?: null
			}

			try {
				migrationCallbacks?.afterMigrations database
			}
			catch (MissingMethodException ignored) {}
		}
		else {
			LOG.info "No migrations to run for '$dsConfigName${schema ? '.'+schema : ''}'"
		}
	}
	
}
