/* Copyright 2012-2013 SpringSource.
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

import liquibase.changelog.ChangeSet
import liquibase.changelog.DatabaseChangeLog
import liquibase.changelog.visitor.ChangeSetVisitor
import liquibase.changelog.visitor.ChangeSetVisitor.Direction
import liquibase.database.Database

/**
 * Used in ScriptUtils.generatePreviousChangesetSql.
 *
 * @author <a href='mailto:burt@burtbeckwith.com'>Burt Beckwith</a>
 */
class NoopVisitor implements ChangeSetVisitor {

	protected Database database

	NoopVisitor(Database db) {
		database = db
	}

	Direction getDirection() { Direction.FORWARD }

	void visit(ChangeSet changeSet, DatabaseChangeLog databaseChangeLog, Database database) {
		changeSet.execute databaseChangeLog, database
	}
}
