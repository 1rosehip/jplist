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
import liquibase.changelog.ChangeSet
import liquibase.changelog.DatabaseChangeLog
import liquibase.database.Database
import liquibase.exception.MigrationFailedException

/**
 * @author <a href='mailto:burt@burtbeckwith.com'>Burt Beckwith</a>
 */
class PendingSQLWriter extends HTMLWriter {

	protected DatabaseChangeLog databaseChangeLog

	PendingSQLWriter(Map files, Database database, DatabaseChangeLog databaseChangeLog) {
		super(files, 'pending', database)
		this.databaseChangeLog = databaseChangeLog
	}

	@Override
	protected String createTitle(object) { 'Pending SQL' }

	protected void writeBody(StringBuilder content, object, List<Change> ranChanges, List<Change> changesToRun) {
		if (!changesToRun) {
			content.append '<b>NONE</b>'
		}

		content.append '<code><pre>'

		ChangeSet lastRunChangeSet

		for (Change change : changesToRun) {
			ChangeSet thisChangeSet = change.changeSet
			if (thisChangeSet.equals(lastRunChangeSet)) {
				continue
			}
			lastRunChangeSet = thisChangeSet
			String anchor = thisChangeSet.toString(false).replaceAll('\\W', '_')
			content.append("<a name='").append(anchor).append("'/>")
			try {
				thisChangeSet.execute databaseChangeLog, database
			}
			catch (MigrationFailedException e) {
				content.append 'EXECUTION ERROR: '
				content.append change.changeMetaData.description
				content.append ': '
				content.append e.message
				content.append '\n\n'
			}
		}
		content.append '</pre></code>'
	}

	@Override
	protected void writeCustomHTML(StringBuilder content, object, List<Change> changes) {
		// do nothing
	}
}
