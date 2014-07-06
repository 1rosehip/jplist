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

import java.lang.reflect.Field

import liquibase.change.Change
import liquibase.change.ChangeProperty
import liquibase.change.ColumnConfig
import liquibase.change.ConstraintsConfig
import liquibase.change.custom.CustomChange
import liquibase.exception.UnexpectedLiquibaseException
import liquibase.serializer.core.string.StringChangeLogSerializer
import liquibase.sql.visitor.SqlVisitor
import liquibase.util.StringUtils

/**
 * Custom Groovy-based change.
 *
 * @author <a href='mailto:burt@burtbeckwith.com'>Burt Beckwith</a>
 */
class GroovyAwareStringChangeLogSerializer extends StringChangeLogSerializer {

	protected static final int INDENT_LENGTH = 4

	String serialize(Change change) {
		change.changeMetaData.name + ':' + serializeObject(change, 1)
	}

	String serialize(SqlVisitor visitor) {
		visitor.name + ':' + serializeObject(visitor, 1)
	}

	protected String serializeObject(objectToSerialize, int indent) {
		try {
			StringBuilder buffer = new StringBuilder('[')

			SortedSet<String> values = new TreeSet<String>()
			Class classToCheck = objectToSerialize.getClass()
			while (!classToCheck.equals(Object)) {
				for (Field field : classToCheck.declaredFields) {
					field.accessible = true
					ChangeProperty changePropertyAnnotation = field.getAnnotation(ChangeProperty)
					if (changePropertyAnnotation && !changePropertyAnnotation.includeInSerialization()) {
						continue
					}

					String propertyName = field.name
					if (propertyName in ['serialVersionUID', 'metaClass'] ||
							propertyName.contains('$') || propertyName.contains('__timeStamp')) {
						continue
					}

					def value = field.get(objectToSerialize)
					if (value instanceof ColumnConfig) {
						values.add(indentTimes(indent) +
							serializeColumnConfig(field.get(objectToSerialize), indent + 1))
					}
					else if (value instanceof ConstraintsConfig) {
						values.add(indentTimes(indent) +
							serializeConstraintsConfig(field.get(objectToSerialize), indent + 1))
					}
					else if (value instanceof CustomChange) {
						values.add(indentTimes(indent) +
							serializeCustomChange(field.get(objectToSerialize), indent + 1))
					}
					else {
						if (value != null) {
							if (value instanceof Map || value instanceof Collection) {
								values.add(indentTimes(indent) + propertyName + '=' + serializeObject(value, indent + 1))
							}
							else {
								values.add(indentTimes(indent) + propertyName + '=\'' + value + '\'')
							}
						}
					}
				}
				classToCheck = classToCheck.superclass
			}

			if (values) {
				buffer.append('\n')
				buffer.append(StringUtils.join(values, '\n'))
				buffer.append('\n')
			}
			buffer.append(indentTimes(indent - 1)).append(']')
			return buffer.toString().replace('\r\n', '\n').replace('\r', '\n')
		}
		catch (Exception e) {
			throw new UnexpectedLiquibaseException(e)
		}
	}

	protected String indentTimes(int indent) {
		StringUtils.repeat ' ', INDENT_LENGTH * indent
	}

	protected String serializeObject(Collection collection, int indent) {
		if (!collection) {
			return '[]'
		}

		String returnString = '[\n'
		for (object in collection) {
			if (object instanceof ColumnConfig) {
				returnString += indentTimes(indent) + serializeColumnConfig(object, indent + 1) + ',\n'
			}
			else {
				returnString += indentTimes(indent) + object + ',\n'
			}
		}
		returnString = returnString.replaceFirst(',$', '')
		returnString += indentTimes(indent - 1) + ']'

		returnString
	}

	protected String serializeObject(Map collection, int indent) {
		if (!collection) {
			return '[]'
		}

		String returnString = '{\n'
		for (key in new TreeSet(collection.keySet())) {
			returnString += indentTimes(indent) + key + '=\'' + collection.get(key) + '\',\n'
		}
		returnString = returnString.replaceFirst(',$', '')
		returnString += indentTimes(indent - 1) + '}'

		returnString
	}

	protected String serializeColumnConfig(ColumnConfig columnConfig, int indent) {
		'column:' + serializeObject(columnConfig, indent)
	}

	protected String serializeConstraintsConfig(ConstraintsConfig constraintsConfig, int indent) {
		'constraints:' + serializeObject(constraintsConfig, indent)
	}

	protected String serializeCustomChange(CustomChange customChange, int indent) {
		'customChange:' + serializeObject(customChange, indent)
	}
}
