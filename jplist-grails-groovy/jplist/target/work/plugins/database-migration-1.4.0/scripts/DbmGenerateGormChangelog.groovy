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

/**
 * @author <a href='mailto:burt@burtbeckwith.com'>Burt Beckwith</a>
 */

includeTargets << new File("$databaseMigrationPluginDir/scripts/_DatabaseMigrationCommon.groovy")

target(dbmGenerateGormChangelog: 'Generates an initial changelog XML file based on the current GORM classes') {
	depends dbmInit

	if (!isHibernateInstalled()) return

	if (!okToWrite(0, true)) return

	def configuredSchema = config.grails.plugin.databasemigration.schema
	String argSchema = argsMap.schema
	String effectiveSchema = argSchema ?: configuredSchema ?: null

	doAndClose {
		ScriptUtils.executeAndWrite argsList[0], booleanArg('add'), dsName, { PrintStream out ->
			def gormDatabase = ScriptUtils.createGormDatabase(dataSourceSuffix, config, appCtx, null, effectiveSchema)
			ScriptUtils.createAndPrintFixedDiff gormDatabase, null, gormDatabase, appCtx, diffTypes, out
		}
	}
}

setDefaultTarget dbmGenerateGormChangelog
