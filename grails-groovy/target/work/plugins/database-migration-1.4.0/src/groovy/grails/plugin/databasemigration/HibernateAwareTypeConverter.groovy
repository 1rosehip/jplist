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

import java.text.ParseException

import liquibase.change.ColumnConfig
import liquibase.database.Database
import liquibase.database.structure.Column
import liquibase.database.structure.type.BigIntType
import liquibase.database.structure.type.BlobType
import liquibase.database.structure.type.BooleanType
import liquibase.database.structure.type.CharType
import liquibase.database.structure.type.ClobType
import liquibase.database.structure.type.CurrencyType
import liquibase.database.structure.type.DataType
import liquibase.database.structure.type.DateTimeType
import liquibase.database.structure.type.DateType
import liquibase.database.structure.type.DoubleType
import liquibase.database.structure.type.FloatType
import liquibase.database.structure.type.IntType
import liquibase.database.structure.type.TextType
import liquibase.database.structure.type.TimeType
import liquibase.database.structure.type.TinyIntType
import liquibase.database.structure.type.UUIDType
import liquibase.database.structure.type.VarcharType
import liquibase.database.typeconversion.TypeConverter
import liquibase.servicelocator.PrioritizedService

/**
 * Uses pre-computed SQL type strings from the Hibernate Dialect which is much better at
 * creating valid SQL types. The strings that Liquibase generates often include size information
 * that the database doesn't support.
 *
 * @author <a href='mailto:burt@burtbeckwith.com'>Burt Beckwith</a>
 */
class HibernateAwareTypeConverter implements TypeConverter {

	protected TypeConverter realConverter

	HibernateAwareTypeConverter(TypeConverter realConverter) {
		this.realConverter = realConverter
	}

	int getPriority() { PrioritizedService.PRIORITY_DATABASE + 10 }

	boolean supports(Database database) { true }

	String convertToDatabaseTypeString(Column referenceColumn, Database database) {
		if (referenceColumn instanceof GormColumn) {
			return referenceColumn.hibernateColumn.sqlType
		}
		return realConverter.convertToDatabaseTypeString(referenceColumn, database)
	}

	Object convertDatabaseValueToObject(Object defaultValue, int dataType, int firstParameter,
			int secondParameter, Database database) throws ParseException {
		return realConverter.convertDatabaseValueToObject(defaultValue, dataType, firstParameter, secondParameter, database)
	}
	DataType getDataType(Object object) { realConverter.getDataType(object) }
	DataType getDataType(String columnTypeString, Boolean autoIncrement) { realConverter.getDataType(columnTypeString, autoIncrement) }
	DataType getDataType(ColumnConfig columnConfig) { realConverter.getDataType(columnConfig) }
	CharType getCharType() { realConverter.getCharType() }
	VarcharType getVarcharType() { realConverter.getVarcharType() }
	BooleanType getBooleanType() { realConverter.getBooleanType() }
	CurrencyType getCurrencyType() { realConverter.getCurrencyType() }
	UUIDType getUUIDType() { realConverter.getUUIDType() }
	TextType getTextType() { realConverter.getTextType() }
	ClobType getClobType() { realConverter.getClobType() }
	BlobType getBlobType() { realConverter.getBlobType() }
	BlobType getLongBlobType() { realConverter.getLongBlobType() }
	DateType getDateType() { realConverter.getDateType() }
	FloatType getFloatType() { realConverter.getFloatType() }
	DoubleType getDoubleType() { realConverter.getDoubleType() }
	IntType getIntType() { realConverter.getIntType() }
	TinyIntType getTinyIntType() { realConverter.getTinyIntType() }
	DateTimeType getDateTimeType() { realConverter.getDateTimeType() }
	TimeType getTimeType() { realConverter.getTimeType() }
	BigIntType getBigIntType() { realConverter.getBigIntType() }
}
