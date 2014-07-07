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

import groovy.sql.Sql

import java.sql.Connection

import liquibase.change.AbstractChange
import liquibase.change.ChangeMetaData
import liquibase.change.ChangeProperty
import liquibase.change.CheckSum
import liquibase.database.Database
import liquibase.database.DatabaseConnection
import liquibase.exception.SetupException
import liquibase.exception.ValidationErrors
import liquibase.exception.Warnings
import liquibase.executor.ExecutorService
import liquibase.executor.LoggingExecutor
import liquibase.statement.SqlStatement

import org.codehaus.groovy.grails.commons.GrailsApplication
import org.springframework.context.ApplicationContext

/**
 * Custom Groovy-based change.
 *
 * @author <a href='mailto:burt@burtbeckwith.com'>Burt Beckwith</a>
 */
class GrailsChange extends AbstractChange {

	@ChangeProperty(includeInSerialization=false)
	protected boolean validateClosureCalled

	@ChangeProperty(includeInSerialization=false)
	protected ValidationErrors validationErrors = new ValidationErrors()

	@ChangeProperty(includeInSerialization=false)
	protected Warnings warnings = new Warnings()

	@ChangeProperty(includeInSerialization=false)
	protected List<SqlStatement> allStatements = []

	@ChangeProperty(includeInSerialization=false)
	protected boolean shouldRun = true

	@ChangeProperty(includeInSerialization=false)
	Database database

	@ChangeProperty(includeInSerialization=false)
	Sql sql

	@ChangeProperty(includeInSerialization=false)
	ApplicationContext ctx

	@ChangeProperty(includeInSerialization=false)
	Closure initClosure

	@ChangeProperty(includeInSerialization=false)
	Closure validateClosure

	@ChangeProperty(includeInSerialization=false)
	Closure changeClosure

	@ChangeProperty(includeInSerialization=false)
	Closure rollbackClosure

	/**
	 * @see liquibase.change.Change#getConfirmationMessage()
	 */
	@ChangeProperty(includeInSerialization=false)
	String confirmationMessage = 'Executed GrailsChange'

	@ChangeProperty(includeInSerialization=false)
	String checksumString

	/**
	 * Constructor.
	 */
	GrailsChange() {
		super('grailsChange', 'Grails Change', ChangeMetaData.PRIORITY_DEFAULT)
	}

	@Override
	void init() throws SetupException {
		if (!initClosure) {
			return
		}

		initClosure.delegate = this
		try {
			initClosure()
		}
		catch (e) {
			throw new SetupException(e)
		}
	}

	@Override
	Warnings warn(Database database) {
		initDatabase database
		if (shouldRun) {
			callValidateClosure()
		}

		warnings
	}

	@Override
	ValidationErrors validate(Database database) {
		initDatabase database
		if (shouldRun) {
			callValidateClosure()
		}

		validationErrors
	}

	/**
	 * Called by the validate closure. Adds a validation error.
	 *
	 * @param message the error message
	 */
	void error(String message) {
		validationErrors.addError message
	}

	/**
	 * Called by the validate closure. Adds a warning message.
	 *
	 * @param warning the warning message
	 */
	void warn(String warning) {
		warnings.addWarning warning
	}

	/**
	 * {@inheritDoc}
	 * @see liquibase.change.Change#generateStatements(liquibase.database.Database)
	 */
	@Override
	SqlStatement[] generateStatements(Database database) {
		initDatabase database

		if (shouldRun && changeClosure) {
			changeClosure.delegate = this
			changeClosure()
		}

		allStatements as SqlStatement[]
	}

	/**
	 * {@inheritDoc}
	 * @see liquibase.change.AbstractChange#generateRollbackStatements(liquibase.database.Database)
	 */
	@Override
	SqlStatement[] generateRollbackStatements(Database database) {
		initDatabase database

		if (shouldRun && rollbackClosure) {
			rollbackClosure.delegate = this
			rollbackClosure()
		}

		allStatements as SqlStatement[]
	}

	/**
	 * Called by the change or rollback closure. Adds a statement to be executed.
	 *
	 * @param statement the statement
	 */
	void sqlStatement(SqlStatement statement) {
		if (shouldRun && statement) allStatements << statement
	}

	/**
	 * Called by the change or rollback closure. Adds multiple statements to be executed.
	 *
	 * @param statement the statement
	 */
	void sqlStatements(statements) {
		if (shouldRun && statements) allStatements.addAll (statements as List)
	}

	/**
	 * Called by the change or rollback closure. Overrides the confirmation message.
	 *
	 * @param message the confirmation message
	 */
	void confirm(String message) { confirmationMessage = message }

	/**
	 * {@inheritDoc}
	 * @see liquibase.change.AbstractChange#supportsRollback(liquibase.database.Database)
	 */
	@Override
	boolean supportsRollback(Database database) { shouldRun }

	/**
	 * {@inheritDoc}
	 * @see liquibase.change.AbstractChange#generateCheckSum()
	 */
	@Override
	CheckSum generateCheckSum() {
//		if (checksumString) {
//			return CheckSum.compute(checksumString)
//		}
//		CheckSum.compute new GroovyAwareStringChangeLogSerializer().serialize(this)

		CheckSum.compute checksumString ?: 'Grails Change'
	}

	/**
	 * Called from the change or rollback closure. Creates a <code>Sql</code> instance from the current connection.
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
	 * Called from the change or rollback closure. Shortcut to get the (wrapper) database connection.
	 *
	 * @return the connection or <code>null</code> if the database isn't set yet
	 */
	DatabaseConnection getDatabaseConnection() { database?.connection }

	/**
	 * Called from the change or rollback closure. Shortcut to get the real database connection.
	 *
	 * @return the connection or <code>null</code> if the database isn't set yet
	 */
	Connection getConnection() { database?.connection?.wrappedConnection }

	/**
	 * Called from the change or rollback closure. Shortcut for the current application.
	 *
	 * @return the application
	 */
	GrailsApplication getApplication() { ctx.grailsApplication }

	// warn is called then validate, but both are handled by
	// the 'warnings' closure, so we only want to run it once
	protected void callValidateClosure() {
		if (!shouldRun || !validateClosure || validateClosureCalled) {
			return
		}

		validateClosure.delegate = this
		validateClosure()
		validationErrors
	}

	protected void initDatabase(Database database) {
		this.database = database
		shouldRun = !(ExecutorService.getInstance().getExecutor(database) instanceof LoggingExecutor)
	}
}
