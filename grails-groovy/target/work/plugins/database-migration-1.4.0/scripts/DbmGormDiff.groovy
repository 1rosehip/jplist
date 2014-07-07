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

includeTargets << new File("$databaseMigrationPluginDir/scripts/_DatabaseMigrationCommon.groovy")

/**
 * Similar to dbm-diff but diffs the current configuration based on the
 * application's domain classes with the database configured for the current environment.
 *
 * Run 'grails dbm-gorm-diff' for the dev environment, or 'grails prod dbm-gorm-diff' for the
 * prod environment, or for a custom environment 'grails -Dgrails.env=staging dbm-gorm-diff'.
 *
 * By default writes to the System.out but if passed a filename parameter will write to
 * that, e.g. 'grails prod dbm-gorm-diff grails-app/conf/migrations/current_prod_diff.xml'.
 * Doesn't modify any existing files - you need to manually merge the output into the
 * changeset along with any necessary modifications.
 *
 * @author <a href='mailto:burt@burtbeckwith.com'>Burt Beckwith</a>
 */

target(dbmGormDiff: 'Diff GORM classes against database and generate a changelog') {
	depends dbmInit

	if (!isHibernateInstalled()) return

	if (!okToWrite(0, true)) return

	def configuredSchema = config.grails.plugin.databasemigration.schema
	String argSchema = argsMap.schema
	String effectiveSchema = argSchema ?: configuredSchema ?: defaultSchema

	def realDatabase

	try {
		printMessage "Starting $hyphenatedScriptName"

		ScriptUtils.executeAndWrite argsList[0], booleanArg('add'), dsName, { PrintStream out ->
			MigrationUtils.executeInSession(dsName) {
				realDatabase = MigrationUtils.getDatabase(effectiveSchema, dsName)
				def gormDatabase = ScriptUtils.createGormDatabase(dataSourceSuffix, config, appCtx, realDatabase, effectiveSchema)
				ScriptUtils.createAndPrintFixedDiff(gormDatabase, realDatabase, realDatabase, appCtx, diffTypes, out)
			}
		}

		printMessage "Finished $hyphenatedScriptName"
	}
	catch (e) {
		ScriptUtils.printStackTrace e
		exit 1
	}
	finally {
		ScriptUtils.closeConnection realDatabase
	}
}

setDefaultTarget dbmGormDiff
