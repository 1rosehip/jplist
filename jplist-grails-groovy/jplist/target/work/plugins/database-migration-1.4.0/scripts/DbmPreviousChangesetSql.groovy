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

target(dbmPreviousChangesetSql: 'Generates the SQL to apply the previous <value> change sets') {
	depends dbmInit

	def count = argsList[0]
	if (!count) {
		errorAndDie "The $hyphenatedScriptName script requires a change set count argument"
	}

	if (!count.isNumber()) {
		errorAndDie "The change set count argument '$count' isn't a number"
	}

	if (!okToWrite(1)) return

	def skip = argsMap.skip ?: '0'
	if (!skip.isNumber()) {
		errorAndDie "The skip argument '$skip' isn't a number"
	}

	doAndClose {
		ScriptUtils.generatePreviousChangesetSql(
			database, liquibase, ScriptUtils.newPrintWriter(argsList, 1), count.toInteger(), skip.toInteger(), contexts)
	}
}

setDefaultTarget dbmPreviousChangesetSql
