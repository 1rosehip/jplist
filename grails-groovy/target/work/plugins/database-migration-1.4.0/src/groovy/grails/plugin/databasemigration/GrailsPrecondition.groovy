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
package grails.plugin.databasemigration

import groovy.sql.Sql

import java.sql.Connection

import liquibase.changelog.ChangeSet
import liquibase.changelog.DatabaseChangeLog
import liquibase.database.Database
import liquibase.database.DatabaseConnection
import liquibase.exception.DatabaseException
import liquibase.exception.PreconditionErrorException
import liquibase.exception.PreconditionFailedException
import liquibase.exception.ValidationErrors
import liquibase.exception.Warnings
import liquibase.precondition.Precondition
import liquibase.resource.ResourceAccessor
import liquibase.snapshot.DatabaseSnapshot
import liquibase.snapshot.DatabaseSnapshotGenerator
import liquibase.snapshot.DatabaseSnapshotGeneratorFactory

import org.codehaus.groovy.grails.commons.GrailsApplication
import org.springframework.context.ApplicationContext

/**
 * Custom Groovy-based precondition.
 *
 * @author <a href='mailto:burt@burtbeckwith.com'>Burt Beckwith</a>
 */
class GrailsPrecondition implements Precondition {

	Closure checkClosure

	// fields accessible to the check closure
	Database database
	DatabaseChangeLog changeLog
	ChangeSet changeSet
	ApplicationContext ctx
	ResourceAccessor resourceAccessor

	/**
	 * {@inheritDoc}
	 * @see liquibase.precondition.Precondition#check(liquibase.database.Database,
	 * 	liquibase.changelog.DatabaseChangeLog, liquibase.changelog.ChangeSet)
	 */
	void check(Database database, DatabaseChangeLog changeLog, ChangeSet changeSet) {
		this.database = database
		this.changeLog = changeLog
		this.changeSet = changeSet

		if (checkClosure) {
			checkClosure.delegate = this

			try {
				checkClosure()
			}
			catch (PreconditionFailedException e) {
				throw e
			}
			catch (AssertionError e) {
				throw new PreconditionFailedException(e.message, changeLog, this)
			}
			catch (e) {
				throw new PreconditionErrorException(e, changeLog, this)
			}
		}
	}

	/**
	 * Called from the check closure as a shortcut to throw a <code>PreconditionFailedException</code>.
	 *
	 * @param message the failure message
	 */
	void fail(String message) {
		throw new PreconditionFailedException(message, changeLog, this)
	}

	/**
	 * Called from the check closure.
	 *
	 * @return the generator for the current database
	 */
	DatabaseSnapshotGenerator createDatabaseSnapshotGenerator() {
		DatabaseSnapshotGeneratorFactory.instance.getGenerator database
	}

	/**
	 * Called from the check closure.
	 *
	 * @param schemaName the schema name
	 * @return a snapshot for the current database and schema name
	 */
	DatabaseSnapshot createDatabaseSnapshot(String schemaName = null) {
		try {
			return DatabaseSnapshotGeneratorFactory.instance.createSnapshot(database, schemaName, null)
		}
		catch (DatabaseException e) {
			throw new PreconditionErrorException(e, changeLog, this)
		}
	}

	/**
	 * Called from the check closure. Creates a <code>Sql</code> instance from the current connection.
	 *
	 * @return the sql instance
	 */
	Sql getSql() {
		if (!connection) return null

		if (!sql) {
			sql = new Sql(connection) {
				protected void closeResources(Connection c) {
					// do nothing, let Liquibase close the connection
				}
			}
		}

		sql
	}

	/**
	 * Called from the check closure. Shortcut to get the (wrapper) database connection.
	 *
	 * @return the connection or <code>null</code> if the database isn't set yet
	 */
	DatabaseConnection getDatabaseConnection() { database?.connection }

	/**
	 * Called from the check closure. Shortcut to get the real database connection.
	 *
	 * @return the connection or <code>null</code> if the database isn't set yet
	 */
	Connection getConnection() { database?.connection?.wrappedConnection }

	/**
	 * Called from the check closure. Shortcut for the current application.
	 *
	 * @return the application
	 */
	GrailsApplication getApplication() { ctx.grailsApplication }

	/**
	 * {@inheritDoc}
	 * @see liquibase.precondition.Precondition#warn(liquibase.database.Database)
	 */
	Warnings warn(Database database) { new Warnings() }

	/**
	 * {@inheritDoc}
	 * @see liquibase.precondition.Precondition#validate(liquibase.database.Database)
	 */
	ValidationErrors validate(Database database) { new ValidationErrors() }

	/**
	 * {@inheritDoc}
	 * @see liquibase.precondition.Precondition#getName()
	 */
	String getName() { 'grailsPrecondition' }
}
