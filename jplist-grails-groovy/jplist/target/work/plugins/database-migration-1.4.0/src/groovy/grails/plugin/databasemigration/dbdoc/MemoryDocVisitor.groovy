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
package grails.plugin.databasemigration.dbdoc

import java.lang.reflect.Field

import liquibase.change.Change
import liquibase.changelog.ChangeSet
import liquibase.changelog.DatabaseChangeLog
import liquibase.changelog.visitor.DBDocVisitor
import liquibase.database.Database
import liquibase.database.structure.Column
import liquibase.database.structure.DatabaseObject
import liquibase.database.structure.Table
import liquibase.resource.ResourceAccessor
import liquibase.snapshot.DatabaseSnapshot
import liquibase.snapshot.DatabaseSnapshotGeneratorFactory

import org.springframework.util.ReflectionUtils

/**
 * @author <a href='mailto:burt@burtbeckwith.com'>Burt Beckwith</a>
 */
class MemoryDocVisitor extends DBDocVisitor {

	protected static final int MAX_RECENT_CHANGE = 50

	protected Database database
	protected SortedSet changeLogs
	protected Map<String, List<Change>> changesByAuthor
	protected Map<DatabaseObject, List<Change>> changesByObject
	protected Map<DatabaseObject, List<Change>> changesToRunByObject
	protected Map<String, List<Change>> changesToRunByAuthor
	protected List<Change> changesToRun
	protected List<Change> recentChanges

	protected String rootChangeLogName
	protected DatabaseChangeLog rootChangeLog

	MemoryDocVisitor(Database database) {
		super(database)
		this.database = database

		changeLogs = getFieldValue('changeLogs')
		changesByAuthor = getFieldValue('changesByAuthor')
		changesByObject = getFieldValue('changesByObject')
		changesToRunByObject = getFieldValue('changesToRunByObject')
		changesToRunByAuthor = getFieldValue('changesToRunByAuthor')
		changesToRun = getFieldValue('changesToRun')
		recentChanges = getFieldValue('recentChanges')
	}

	void visit(ChangeSet changeSet, DatabaseChangeLog databaseChangeLog, Database database) {
		if (rootChangeLogName == null) {
			rootChangeLogName = changeSet.getFilePath()
		}

		if (rootChangeLog == null) {
			rootChangeLog = databaseChangeLog
		}

		super.visit changeSet, databaseChangeLog, database
	}

	Map generateHTML(ResourceAccessor resourceAccessor) {

		DatabaseSnapshot snapshot = DatabaseSnapshotGeneratorFactory.instance.createSnapshot(
			database, null, null)
		Map files = [:]

		new ChangeLogListWriter(files).writeHTML(changeLogs)
		new TableListWriter(files).writeHTML(new TreeSet<Object>(snapshot.getTables()))
		new AuthorListWriter(files).writeHTML(new TreeSet<Object>(changesByAuthor.keySet()))

		HTMLWriter authorWriter = new AuthorWriter(files, database)
		for (String author : changesByAuthor.keySet()) {
			authorWriter.writeHTML(author, changesByAuthor.get(author), changesToRunByAuthor.get(author), rootChangeLogName)
		}

		HTMLWriter tableWriter = new TableWriter(files, database)
		for (Table table : snapshot.getTables()) {
			tableWriter.writeHTML(table, changesByObject.get(table), changesToRunByObject.get(table), rootChangeLogName)
		}

		HTMLWriter columnWriter = new ColumnWriter(files, database)
		for (Column column : snapshot.getColumns()) {
			columnWriter.writeHTML(column, changesByObject.get(column), changesToRunByObject.get(column), rootChangeLogName)
		}

		ChangeLogWriter changeLogWriter = new ChangeLogWriter(resourceAccessor, files)
		for (changeLog in changeLogs) {
			changeLogWriter.writeChangeLog(changeLog.logicalPath, changeLog.physicalPath)
		}

		HTMLWriter pendingChangesWriter = new PendingChangesWriter(files, database)
		pendingChangesWriter.writeHTML('index', null, changesToRun, rootChangeLogName)

		HTMLWriter pendingSQLWriter = new PendingSQLWriter(files, database, rootChangeLog)
		pendingSQLWriter.writeHTML('sql', null, changesToRun, rootChangeLogName)

		HTMLWriter recentChangesWriter = new RecentChangesWriter(files, database)
		if (recentChanges.size() > MAX_RECENT_CHANGE) {
			recentChanges = recentChanges.subList(0, MAX_RECENT_CHANGE)
		}
		recentChangesWriter.writeHTML('index', recentChanges, null, rootChangeLogName)

		files
	}

	protected getFieldValue(String name) {
		Field field = ReflectionUtils.findField(getClass().superclass, name)
		field.accessible = true
		ReflectionUtils.getField field, this
	}
}
