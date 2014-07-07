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

import liquibase.database.Database
import liquibase.database.structure.DatabaseObject
import liquibase.exception.ValidationErrors
import liquibase.exception.Warnings
import liquibase.sql.Sql
import liquibase.sql.UnparsedSql
import liquibase.sqlgenerator.SqlGenerator
import liquibase.sqlgenerator.SqlGeneratorChain
import liquibase.sqlgenerator.core.CreateTableGenerator
import liquibase.statement.SqlStatement

/**
 * Adds 'ENGINE=InnoDB' if using an InnoDB dialect.<p/>
 *
 * Funky implementation using composition because of a Groovy bug when subclassing
 * <code>CreateTableGenerator</code> to just override <code>generateSql</code>:
 * 'Method "generateSql" in class grails/plugin/databasemigration/MysqlAwareCreateTableGenerator has illegal signature "L[Lliquibase/sql/Sql;;"'.
 *
 * @author <a href='mailto:burt@burtbeckwith.com'>Burt Beckwith</a>
 */
class MysqlAwareCreateTableGenerator implements SqlGenerator {

	protected CreateTableGenerator _super = new CreateTableGenerator()

	Sql[] generateSql(SqlStatement statement, Database database, SqlGeneratorChain chain) {
		Sql[] statements = _super.generateSql(statement, database, chain)
		if (statements && statements.length == 1 && (statements[0] instanceof UnparsedSql)) {
			statements = updateSql(statements, database)
		}
		statements
	}

	// no-op in most cases but adds 'ENGINE=InnoDB' if using InnoDB
	protected Sql[] updateSql(Sql[] statements, Database database) {
		UnparsedSql newSql = new UnparsedSql(statements[0].toSql() + database.dialect.tableTypeString,
				statements[0].endDelimiter, statements[0].affectedDatabaseObjects as DatabaseObject[])
		[newSql] as Sql[]
	}

	ValidationErrors validate(SqlStatement statement, Database database, SqlGeneratorChain chain) {
		_super.validate statement, database, chain
	}

	int getPriority() {
		_super.priority
	}

	boolean supports(SqlStatement statement, Database database) {
		_super.supports statement, database
	}

	boolean requiresUpdatedDatabaseMetadata(Database database) {
		_super.requiresUpdatedDatabaseMetadata database
	}

	Warnings warn(SqlStatement statementType, Database database, SqlGeneratorChain chain) {
		_super.warn statementType, database, chain
	}
}
