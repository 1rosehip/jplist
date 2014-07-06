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

import liquibase.executor.ExecutorService
import liquibase.statement.core.SelectFromDatabaseChangeLogStatement

/**
 * @author <a href='mailto:burt@burtbeckwith.com'>Burt Beckwith</a>
 */

includeTargets << new File("$databaseMigrationPluginDir/scripts/_DatabaseMigrationCommon.groovy")

target(dbmListTags: "Lists the tags in the current database") {
	depends dbmInit

	doAndClose {

		def database = MigrationUtils.getDatabase()

		def tags = []
		def rows = ExecutorService.instance.getExecutor(database).queryForList(new SelectFromDatabaseChangeLogStatement("tag"))
		for (row in rows) {
			row.each { key, tag ->
				if ('tag'.equalsIgnoreCase(key) && tag) {
					tags << tag
				}
			}
		}

		if (tags) {
			println "\nFound the following tags:"
			for (tag in tags) {
				println "   $tag"
			}
		}
		else {
			println "\nNo tags found"
		}
	}
}

setDefaultTarget dbmListTags
