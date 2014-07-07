/* Copyright 2010-2013 SpringSource.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
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
package grails.plugin.databasemigration.dbdoc

import liquibase.change.Change
import liquibase.database.Database
import liquibase.database.typeconversion.TypeConverterFactory

/**
 * @author <a href='mailto:burt@burtbeckwith.com'>Burt Beckwith</a>
 */
class TableWriter extends HTMLWriter {

	TableWriter(Map files, Database database) {
		super(files, 'tables', database)
	}

	@Override
	protected String createTitle(object) { """Changes affecting table "$object" """ }

	@Override
	protected void writeCustomHTML(StringBuilder content, table, List<Change> changes) {
		List<List<String>> cells = table.columns.collect {
			[TypeConverterFactory.instance.findTypeConverter(database).convertToDatabaseTypeString(it, database),
			 """<a href="columns/${table.name.toLowerCase()}/${it.name.toLowerCase()}">$it.name</a>""".toString()]
		}
		writeTable 'Current Columns', cells, content
	}
}
