/* Copyright 2013 SpringSource.
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

import liquibase.change.Change
import liquibase.change.core.AddForeignKeyConstraintChange
import liquibase.changelog.ChangeSet
import liquibase.serializer.core.xml.XMLChangeLogSerializer

/**
 * Reorder ChangeSets with Foreign Key changes to the end of changes.<p/>
 *
 * MySQL need the Indexes created before a Foreign Key with the same name, elsewhere it throws an ERROR 1280 (42000): Incorrect index name '*INDEXNAME*'
 * @see <a href="http://bugs.mysql.com/bug.php?id=55465">http://bugs.mysql.com/bug.php?id=55465</a>
 */
class MySQLCompatibleChangeLogSerializer extends XMLChangeLogSerializer {

	@Override
	void write(List<ChangeSet> changeSets, OutputStream out) throws IOException {
		super.write reorderForeignKeysToEnd(changeSets), out
	}

	protected static List<ChangeSet> reorderForeignKeysToEnd(List<ChangeSet> changeSets) {
		List<ChangeSet> foreignKeyChangeSets = []
		List<ChangeSet> newChangeSets = []

		for (ChangeSet changeSet in changeSets) {
			if (hasForeignKeyConstraintChange(changeSet)) {
				foreignKeyChangeSets << changeSet
			}
			else {
				newChangeSets << changeSet
			}
		}

		newChangeSets + foreignKeyChangeSets
	}

	protected static boolean hasForeignKeyConstraintChange(ChangeSet changeSet) {
		changeSet.changes.find { Change change -> change instanceof AddForeignKeyConstraintChange }
	}
}
