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

import java.lang.reflect.Field

import liquibase.database.Database
import liquibase.database.structure.Column
import liquibase.diff.Diff
import liquibase.diff.DiffResult
import liquibase.exception.DatabaseException
import liquibase.snapshot.DatabaseSnapshot

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.util.ReflectionUtils

/**
 * @author <a href='mailto:burt@burtbeckwith.com'>Burt Beckwith</a>
 */
class GormDiff extends Diff {

	protected Logger log = LoggerFactory.getLogger(getClass())
	protected /*org.hibernate.dialect.Dialect*/ dialect

	GormDiff(GormDatabase referenceDatabase, Database targetDatabase) {
		super(referenceDatabase, targetDatabase)
		dialect = referenceDatabase.dialect
	}

	@Override
	DiffResult compare() throws DatabaseException {
		DiffResult diffResult = super.compare()

		DatabaseSnapshot referenceSnapshot = getFieldValue('referenceSnapshot')
		DatabaseSnapshot targetSnapshot = getFieldValue('targetSnapshot')

		for (Column baseColumn : referenceSnapshot.getColumns()) {
			Collection<Column> targetSnapshotColumns = targetSnapshot.getColumns()
			if (!targetSnapshotColumns.contains(baseColumn) &&
					(baseColumn.getTable() == null || !diffResult.getMissingTables().contains(baseColumn.getTable())) &&
					(baseColumn.getView() == null || !diffResult.getMissingViews().contains(baseColumn.getView()))) {
				diffResult.addMissingColumn baseColumn
			}
		}

		for (Column targetColumn : targetSnapshot.getColumns()) {
			Set<Column> referenceSnapshotColumns = referenceSnapshot.getColumns()
			if (!contains(referenceSnapshotColumns, targetColumn) &&
					(targetColumn.getTable() == null || !diffResult.getUnexpectedTables().contains(targetColumn.getTable())) &&
					(targetColumn.getView() == null || !diffResult.getUnexpectedViews().contains(targetColumn.getView()))) {
				diffResult.addUnexpectedColumn targetColumn
			}
			else if (targetColumn.getTable() != null && !diffResult.getUnexpectedTables().contains(targetColumn.getTable())) {
				Column baseColumn = referenceSnapshot.getColumn(targetColumn.getTable().getName(), targetColumn.getName())
				if (baseColumn == null || isDifferent(targetColumn, baseColumn)) {
					diffResult.addChangedColumn targetColumn
				}
			}
		}

		return diffResult
	}

	protected boolean contains(Set<Column> columns, Column column) {
		// can't trust HashSet.contains() since the Liquibase Column.equals() checks for exact class match

		if (columns.contains(column)) {
			return true
		}

		int hash = column.hashCode()
		for (Column c in columns) {
			if (c.hashCode() != hash) {
				continue
			}
			if (c == column) {
				return true
			}
		}

		false
	}

	protected getFieldValue(String name) {
		Field field = ReflectionUtils.findField(getClass().superclass, name)
		field.accessible = true
		field.get(this)
	}

	protected boolean isDifferent(Column targetColumn, Column baseColumn) {
		if (targetColumn.isNullabilityDifferent(baseColumn)) {
			log.debug "$targetColumn.name nullability different: $targetColumn.nullable / $baseColumn.nullable"
			return true
		}

		if (!targetColumn.isCertainDataType() || !baseColumn.isCertainDataType()) {
			log.debug "$targetColumn.name certainDataType different: $targetColumn.certainDataType / $baseColumn.certainDataType"
			return true
		}

		if (areEquivalent(targetColumn, baseColumn)) {
			return false
		}

		if (targetColumn.getDataType() != baseColumn.getDataType()) {
			log.debug "$targetColumn.name data type different: $targetColumn.dataType / $baseColumn.dataType"
			return true
		}

		if (targetColumn.getLengthSemantics() != baseColumn.getLengthSemantics()) {
			log.debug "$targetColumn.name LengthSemantics different: $targetColumn.lengthSemantics / $baseColumn.lengthSemantics"
			return true
		}

		if (targetColumn.getColumnSize() != baseColumn.getColumnSize()) {
			log.debug "$targetColumn.name column size different: $targetColumn.columnSize / $baseColumn.columnSize"
			return true
		}

		if (targetColumn.getDecimalDigits() != baseColumn.getDecimalDigits()) {
			log.debug "$targetColumn.name decimal digits different: $targetColumn.decimalDigits / $baseColumn.decimalDigits"
			return true
		}

		return false
	}

	protected boolean areEquivalent(Column targetColumn, Column baseColumn) {
		if (baseColumn.sqlTypeSet && baseColumn.typeName.equalsIgnoreCase(targetColumn.typeName)) {
			return true
		}

		log.debug """Comparing target column $targetColumn($targetColumn.dataType, $targetColumn.columnSize, $targetColumn.columnSize, $targetColumn.decimalDigits, $targetColumn.typeName)
with base column $baseColumn($baseColumn.dataType, $baseColumn.columnSize, $baseColumn.columnSize, $baseColumn.decimalDigits, $baseColumn.typeName, $baseColumn.sqlTypeSet)"""
		try {
			String targetTypeName = dialect.getTypeName(targetColumn.dataType, targetColumn.columnSize, targetColumn.columnSize, targetColumn.decimalDigits)
			String baseTypeName = dialect.getTypeName(baseColumn.dataType, baseColumn.columnSize, baseColumn.columnSize, baseColumn.decimalDigits)
			return targetTypeName == baseTypeName
		}
		catch (e) {
			log.warn "Failed to compare type... We will continue with the comparison", e
			return false
		}
	}

	@Override
	boolean shouldDiffColumns() {
		// return false so we can do the work in compare() - can't override since it's private
		false
	}
}
