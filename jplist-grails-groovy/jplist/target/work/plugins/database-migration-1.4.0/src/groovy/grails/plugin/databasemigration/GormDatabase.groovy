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
package grails.plugin.databasemigration

import liquibase.database.AbstractDatabase
import liquibase.database.DatabaseConnection

/**
 * Used by the gorm-diff script. Doesn't do much - it's mostly a holder for the configuration.
 *
 * @author <a href='mailto:burt@burtbeckwith.com'>Burt Beckwith</a>
 */
class GormDatabase extends AbstractDatabase {

	/*org.hibernate.cfg.Configuration*/ def configuration
	/*org.hibernate.dialect.Dialect*/ def dialect
	String schema

	GormDatabase(/*org.hibernate.cfg.Configuration*/ configuration, String schema = null) {
		this.configuration = configuration
		this.schema = schema

		dialect = MigrationUtils.createInstance(configuration.getProperty('hibernate.dialect'))
	}

	String getDatabaseProductName() { 'GORM Mapping' }

	String getTypeName() { 'GORM' }

	// unused interface methods

	void setConnection(DatabaseConnection conn) {
		throw new UnsupportedOperationException()
	}

	boolean isCorrectDatabaseImplementation(DatabaseConnection conn) {
		throw new UnsupportedOperationException()
	}

	String getDefaultDriver(String url) {
		throw new UnsupportedOperationException()
	}

	boolean supportsInitiallyDeferrableColumns() {
		throw new UnsupportedOperationException()
	}

	String getCurrentDateTimeFunction() {
		throw new UnsupportedOperationException()
	}

	boolean supportsTablespaces() {
		throw new UnsupportedOperationException()
	}

	int getPriority() {
		throw new UnsupportedOperationException()
	}
}
