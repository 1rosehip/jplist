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

import java.lang.reflect.Method
import java.sql.Types

import liquibase.database.structure.Column
import liquibase.database.structure.Table

/**
 * @author <a href='mailto:burt@burtbeckwith.com'>Burt Beckwith</a>
 */
class GormColumn extends Column {

	protected static final List DECIMAL_TYPES = [Types.FLOAT, Types.REAL, Types.DOUBLE, Types.NUMERIC, Types.DECIMAL]
	protected static final List LENGTH_TYPES = [Types.CHAR, Types.DATE, Types.LONGVARCHAR, Types.TIME, Types.TIMESTAMP, Types.VARCHAR]

	protected hibernateColumn

	boolean sqlTypeSet = false

	GormColumn(Table table, /*org.hibernate.mapping.Column*/ hibernateColumn, /*org.hibernate.mapping.Table*/ hibernateTable,
	           /*org.hibernate.engine.Mapping*/ mapping, /*org.hibernate.dialect.Dialect*/ dialect, /*org.hibernate.cfg.Configuration*/ cfg) {

		this.hibernateColumn = hibernateColumn

		int decimalDigits = hibernateColumn.scale
		int dataType = hibernateColumn.getSqlTypeCode(mapping)
		if (!typeHasScaleAndPrecision(dataType)) {
			decimalDigits = 0
		}
		if (!typeHasLength(dataType)) {
			decimalDigits = 0
		}

		if (hibernateColumn.sqlType) {
			sqlTypeSet = true
		}
		else {
			hibernateColumn.sqlType = hibernateColumn.getSqlType(dialect, mapping)
			sqlTypeSet = hibernateColumn.sqlType != null
		}

		setName hibernateColumn.name
		setDataType dataType
		setDecimalDigits decimalDigits
		setDefaultValue hibernateColumn.defaultValue
		setNullable hibernateColumn.nullable
		setPrimaryKey hibernateTable.primaryKey == null ? false : hibernateTable.primaryKey.columns.contains(hibernateColumn)
		setTable table
		setTypeName hibernateColumn.getSqlType(dialect, mapping).replaceFirst('\\(.*\\)', '')
		setUnique hibernateColumn.unique
		setAutoIncrement isIdentityColumn(hibernateColumn.value, dialect, cfg)
		setCertainDataType hibernateColumn.sqlType != null
		setColumnSize isNumeric() ? hibernateColumn.precision : hibernateColumn.length
	}

	def getHibernateColumn() {
		hibernateColumn
	}

	// workaround for changed method signature without backwards compatibility
	protected static boolean isIdentityColumn(/*org.hibernate.mapping.Value*/ value, /*org.hibernate.dialect.Dialect*/ dialect, /*org.hibernate.cfg.Configuration*/ cfg) {
		Method method = value.getClass().methods.find { it.name == 'isIdentityColumn' }
		if (method.getParameterTypes().length == 1) {
			// pre-3.6 Hibernate
			return value.isIdentityColumn(dialect)
		}

		value.isIdentityColumn cfg.identifierGeneratorFactory, dialect
	}

	// from org.hibernate.cfg.reveng.JDBCToHibernateTypeHelper
	protected static boolean typeHasScaleAndPrecision(int sqlType) {
		sqlType in DECIMAL_TYPES
	}

	// from org.hibernate.cfg.reveng.JDBCToHibernateTypeHelper
	protected static boolean typeHasLength(int sqlType) {
		sqlType in LENGTH_TYPES
	}

	// have to re-implement since base class does exact class check
	@Override
	boolean equals(other) {
		if (is(other)) return true
		if (!(other instanceof Column)) return false

		Column column = other

		name.equalsIgnoreCase(column.name) && column.table == table && column.view == view
	}
	
	// have to re-implement since base class does case-sensitive column-name comparison
	@Override
	int compareTo(Column o) {
		int d
		if (table || o.table) {
			d = table <=> o.table
		}
		else {
			d = view <=> o.view
		}
		d ?: name.compareToIgnoreCase(o.name)
	}
}
