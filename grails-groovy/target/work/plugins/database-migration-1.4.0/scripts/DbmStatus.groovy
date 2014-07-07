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

target(dbmStatus: 'Outputs list of unrun change sets') {
	depends dbmInit

	if (!okToWrite()) return

	doAndClose {
		boolean verbose = argsMap.verbose == null ? true : Boolean.valueOf(argsMap.verbose)
		liquibase.reportStatus verbose, contexts, ScriptUtils.newOutputStreamWriter(argsList)
	}
}

setDefaultTarget dbmStatus
