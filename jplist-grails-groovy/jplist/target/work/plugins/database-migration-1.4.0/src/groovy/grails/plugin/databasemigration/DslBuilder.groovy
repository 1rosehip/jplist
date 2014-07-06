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
import java.util.jar.JarFile

import liquibase.change.Change
import liquibase.change.ChangeFactory
import liquibase.change.ChangeWithColumns
import liquibase.change.ColumnConfig
import liquibase.change.ConstraintsConfig
import liquibase.change.core.CreateProcedureChange
import liquibase.change.core.CreateViewChange
import liquibase.change.core.DeleteDataChange
import liquibase.change.core.ExecuteShellCommandChange
import liquibase.change.core.InsertDataChange
import liquibase.change.core.LoadDataChange
import liquibase.change.core.LoadDataColumnConfig
import liquibase.change.core.RawSQLChange
import liquibase.change.core.SQLFileChange
import liquibase.change.core.StopChange
import liquibase.change.core.UpdateDataChange
import liquibase.change.custom.CustomChangeWrapper
import liquibase.changelog.ChangeLogParameters
import liquibase.changelog.ChangeSet
import liquibase.changelog.DatabaseChangeLog
import liquibase.exception.ChangeLogParseException
import liquibase.exception.LiquibaseException
import liquibase.exception.MigrationFailedException
import liquibase.parser.ChangeLogParser
import liquibase.parser.ChangeLogParserFactory
import liquibase.precondition.CustomPreconditionWrapper
import liquibase.precondition.Precondition
import liquibase.precondition.PreconditionFactory
import liquibase.precondition.PreconditionLogic
import liquibase.precondition.core.PreconditionContainer
import liquibase.resource.ResourceAccessor
import liquibase.sql.visitor.SqlVisitor
import liquibase.sql.visitor.SqlVisitorFactory
import liquibase.util.ObjectUtil
import liquibase.util.StringUtils
import liquibase.util.file.FilenameUtils

import org.codehaus.groovy.runtime.InvokerHelper
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.context.ApplicationContext

/**
 * Based on <code>liquibase.parser.core.xml.XMLChangeLogSAXHandler</code>.
 *
 * @author <a href='mailto:burt@burtbeckwith.com'>Burt Beckwith</a>
 */
class DslBuilder extends BuilderSupport {

	protected Logger log = LoggerFactory.getLogger(getClass())

	protected Change currentChange
	protected String currentText
	protected ChangeSet currentChangeSet
	protected String currentParamName
	protected Precondition currentPrecondition
	protected PreconditionContainer rootPrecondition
	protected List changeSubObjects = []
	protected List<PreconditionLogic> preconditionLogicStack = []
	protected boolean inRollback
	protected boolean inModifySql
	protected boolean modifySqlAppliedOnRollback
	protected Set<String> modifySqlDbmsList
	protected Set<String> modifySqlContexts

	protected ResourceAccessor resourceAccessor
	protected ChangeLogParameters changeLogParameters
	protected ApplicationContext ctx

	// set after the parser runs
	DatabaseChangeLog databaseChangeLog

	DslBuilder(ChangeLogParameters changeLogParameters, ResourceAccessor resourceAccessor,
	           String changeLogLocation, ApplicationContext ctx) {

		this.changeLogParameters = changeLogParameters
		this.resourceAccessor = resourceAccessor
		this.ctx = ctx

		databaseChangeLog = new DatabaseChangeLog()
		databaseChangeLog.setPhysicalFilePath changeLogLocation
		databaseChangeLog.setChangeLogParameters changeLogParameters
	}

	@Override
	def invokeMethod(String methodName, args) {

		if (currentChange instanceof GrailsChange &&
				processGrailsChangeProperty(methodName, args)) {
			return
		}

		if (currentPrecondition instanceof GrailsPrecondition &&
				processGrailsPreconditionProperty(methodName, args)) {
			return
		}

		super.invokeMethod methodName, args
	}

	@Override
	protected createNode(name, Map attributes, value) {

		attributes = expandExpressions(attributes)

		if ('comment' == name) {
			setText value
		}
		else if ('validCheckSum' == name) {
			setText value
		}
		else if ('logicalFilePath' == name) {
			databaseChangeLog.logicalFilePath = value
		}
		else if ('databaseChangeLog' == name) {
			databaseChangeLog.setLogicalFilePath attributes.logicalFilePath
		}
		else if ('include' == name) {
			handleIncludedChangeLog attributes.file.replace('\\', '/'),
				Boolean.parseBoolean(attributes.relativeToChangelogFile),
				databaseChangeLog.physicalFilePath
		}
		else if ('includeAll' == name) {
			processIncludeAll attributes
		}
		else if (!currentChangeSet && 'changeSet' == name) {
			processChangeSet attributes
		}
		else if (currentChangeSet && 'rollback' == name) {
			setText value
			processRollback attributes
		}
		else if ('preConditions' == name) {
			processPreConditions attributes
		}
		else if (currentPrecondition instanceof CustomPreconditionWrapper && 'param' == name) {
			currentPrecondition.setParam attributes.name, attributes.value
		}
		else if (rootPrecondition) {
			currentPrecondition = PreconditionFactory.instance.create(name)

			setPropertiesFromAttributes currentPrecondition, attributes
			preconditionLogicStack[-1].addNestedPrecondition currentPrecondition

			if (currentPrecondition instanceof PreconditionLogic) {
				preconditionLogicStack << currentPrecondition
			}
			else if (currentPrecondition instanceof GrailsPrecondition) {
				currentPrecondition.ctx = ctx
				currentPrecondition.resourceAccessor = resourceAccessor
			}

			if ('sqlCheck' == name) {
				setText value
			}
		}
		else if ('modifySql' == name) {
			processModifySql attributes
		}
		else if (inModifySql) {
			SqlVisitor sqlVisitor = SqlVisitorFactory.instance.create(name)
			setPropertiesFromAttributes sqlVisitor, attributes
			sqlVisitor.setApplicableDbms modifySqlDbmsList
			sqlVisitor.setApplyToRollback modifySqlAppliedOnRollback
			sqlVisitor.setContexts modifySqlContexts
			currentChangeSet.addSqlVisitor sqlVisitor
		}
		else if (currentChangeSet && !currentChange) {
			processChange name, attributes, value
		}
		else if (currentChange && 'column' == name) {
			processColumn attributes
		}
		else if (currentChange && 'constraints' == name) {
			processConstraints attributes
		}
		else if ('param' == name) {
			processParam attributes
		}
		else if ('where' == name || 'whereLazy' == name) {
			setText value
		}
		else if ('property' == name) {
			processProperty attributes
		}
		else if (currentChange instanceof ExecuteShellCommandChange && 'arg' == name) {
			currentChange.addArg attributes.value
		}
		else if (currentChange) {
			String creatorMethod = 'create' + name[0].toUpperCase() + name[1..-1]
			def objectToCreateFrom = changeSubObjects ? changeSubObjects[-1] : currentChange
			Method method
			try {
				method = objectToCreateFrom.getClass().getMethod(creatorMethod)
			}
			catch (NoSuchMethodException e) {
				throw new MigrationFailedException(currentChangeSet,
					"Could not find creator method $creatorMethod for tag: $name")
			}
			def subObject = method.invoke(objectToCreateFrom)
			setPropertiesFromAttributes subObject, attributes
			changeSubObjects << subObject
		}
		else {
			throw new MigrationFailedException(currentChangeSet, "Unexpected tag: $name")
		}

		name
	}

	protected Map expandExpressions(Map original) {
		def expanded = [:]
		original.each { name, value ->
			expanded[name] = changeLogParameters.expandExpressions(original[name]?.toString())
		}
		expanded
	}

	protected boolean processGrailsChangeProperty(String methodName, args) {
		args = InvokerHelper.asList(args)

		switch (methodName.toLowerCase()) {
			case 'init':
				if (args.size() == 1 && args[0] instanceof Closure) {
					currentChange.initClosure = args[0]
					return true
				}
				break

			case 'validate':
				if (args.size() == 1 && args[0] instanceof Closure) {
					currentChange.validateClosure = args[0]
					return true
				}
				break

			case 'change':
				if (args.size() == 1 && args[0] instanceof Closure) {
					currentChange.changeClosure = args[0]
					return true
				}
				break

			case 'rollback':
				if (args.size() == 1 && args[0] instanceof Closure) {
					currentChange.rollbackClosure = args[0]
					return true
				}
				break

			case 'confirm':
				if (args.size() == 1 && args[0] instanceof CharSequence) {
					currentChange.confirmationMessage = args[0].toString()
					return true
				}
				break

			case 'checksum':
				if (args.size() == 1 && args[0] instanceof CharSequence) {
					currentChange.checksumString = args[0].toString()
					return true
				}
				break

			case 'priority':
				if (args.size() == 1 && args[0] instanceof Number) {
					currentChange.priority = args[0].intValue()
					return true
				}
				break
		}

		false
	}

	protected boolean processGrailsPreconditionProperty(String methodName, args) {
		args = InvokerHelper.asList(args)

		if ('check' == methodName.toLowerCase() &&
				args.size() == 1 && args[0] instanceof Closure) {
			currentPrecondition.checkClosure = args[0]
			return true
		}

		false
	}

	protected void setText(String value) {
		currentText = changeLogParameters.expandExpressions(StringUtils.trimToNull(value))
	}

	protected void processIncludeAll(Map attributes) {
		String pathName = attributes.path.replace('\\', '/')
		if (!pathName.endsWith('/')) {
			pathName += '/'
		}

		log.debug "includeAll for $pathName"
		log.debug "Using file opener for includeAll: $resourceAccessor"

		if (Boolean.parseBoolean(attributes.relativeToChangelogFile)) {
			File changeLogFile = new File(databaseChangeLog.physicalFilePath)
			File resourceBase = new File(changeLogFile.parent, pathName)
			if (!resourceBase.exists()) {
				throw new ChangeLogParseException(
					"Resource directory for includeAll does not exist [$resourceBase.path]")
			}
			pathName = resourceBase.path.replace('\\', '/') + '/'
		}

		SortedSet<URL> resources = new TreeSet<URL>(new Comparator<URL>() {
			int compare(URL o1, URL o2) { o1.toString() <=> o2.toString() }
		})
		resourceAccessor.getResources(pathName).each { resources.add it }

		boolean foundResource = false
		Set<String> seenPaths = []
		for (URL fileUrl : resources) {
			if (!fileUrl.toExternalForm().startsWith('file:')) {
				if (fileUrl.toExternalForm().startsWith('jar:file:') ||
				    fileUrl.toExternalForm().startsWith('wsjar:file:') ||
				    fileUrl.toExternalForm().startsWith('zip:')) {
					fileUrl = new File(extractZipFile(fileUrl), pathName).toURI().toURL()
				}
				else {
					log.debug "${fileUrl.toExternalForm()} is not a file path"
					continue
				}
			}
			File file = new File(fileUrl.toURI())
			log.debug "includeAll using path $file.canonicalPath"
			if (!file.exists()) {
				throw new ChangeLogParseException("includeAll path $pathName could not be found. Tried in $file")
			}
			if (file.isDirectory()) {
				log.debug "$file.canonicalPath is a directory"
				for (File childFile : new TreeSet<File>(file.listFiles() as List)) {
					String path = pathName + childFile.name
					if (!seenPaths.add(path)) {
						log.debug "already included $path"
						continue
					}

					if (handleIncludedChangeLog(path, false, databaseChangeLog.physicalFilePath)) {
						foundResource = true
					}
				}
			}
			else {
				String path = pathName + file.name
				if (!seenPaths.add(path)) {
					log.debug "already included $path"
					continue
				}
				if (handleIncludedChangeLog(path, false, databaseChangeLog.physicalFilePath)) {
					foundResource = true
				}
			}
		}

		if (!foundResource) {
			throw new ChangeLogParseException("Could not find directory or directory was empty for includeAll '$pathName'")
		}
	}

	protected File extractZipFile(URL resource) {
		String path = resource.file.split('!')[0]
		if (path.matches('file:\\/[A-Za-z]:\\/.*')) {
			path = path.replaceFirst('file:\\/', '')
		}
		else {
			path = path.replaceFirst('file:', '')
		}

		File tempDir = File.createTempFile('liquibase-sax', '.dir')
		tempDir.deleteDir()
		tempDir.mkdir()

		File zipfile = new File(URLDecoder.decode(path))
		new JarFile(zipfile).entries().each { new File(tempDir, it.name).mkdirs() }

		tempDir
	}

	protected void processChangeSet(Map attributes) {
		boolean alwaysRun = 'true'.equalsIgnoreCase(attributes.runAlways)
		boolean runOnChange = 'true'.equalsIgnoreCase(attributes.runOnChange)
		String filePath = attributes.logicalFilePath ?: databaseChangeLog.filePath

		if (attributes.runInTransaction == null) {
			attributes.runInTransaction = true // default from XSD
		}

		currentChangeSet = new ChangeSet(attributes.id, attributes.author, alwaysRun, runOnChange,
			filePath, attributes.context, attributes.dbms,Boolean.valueOf(attributes.runInTransaction))

		if (StringUtils.trimToNull(attributes.failOnError)) {
			currentChangeSet.setFailOnError Boolean.parseBoolean(attributes.failOnError)
		}

		if (StringUtils.trimToNull(attributes.onValidationFail)) {
			currentChangeSet.setOnValidationFail(
				ChangeSet.ValidationFailOption.valueOf(attributes.onValidationFail))
		}
	}

	protected void processRollback(Map attributes) {
		inRollback = true
		String id = attributes.changeSetId
		if (id == null) {
			return
		}

		String path = attributes.changeSetPath
		if (path == null) {
			path = databaseChangeLog.filePath
		}

		String author = attributes.changeSetAuthor

		ChangeSet cs = databaseChangeLog.getChangeSet(path, author, id)
		if (!cs) {
			throw new ChangeLogParseException("Could not find changeSet to use for rollback: $path:$author:$id")
		}

		cs.changes.each { currentChangeSet.addRollbackChange it }
	}

	protected void processPreConditions(Map attributes) {
		rootPrecondition = new PreconditionContainer()
		rootPrecondition.setOnFail StringUtils.trimToNull(attributes.onFail)
		rootPrecondition.setOnError StringUtils.trimToNull(attributes.onError)
		rootPrecondition.setOnFailMessage StringUtils.trimToNull(attributes.onFailMessage)
		rootPrecondition.setOnErrorMessage StringUtils.trimToNull(attributes.onErrorMessage)
		rootPrecondition.setOnSqlOutput StringUtils.trimToNull(attributes.onSqlOutput)
		preconditionLogicStack << rootPrecondition
	}

	protected void processModifySql(Map attributes) {
		inModifySql = true

		if (StringUtils.trimToNull(attributes.dbms)) {
			modifySqlDbmsList = StringUtils.splitAndTrim(attributes.dbms, ',') as Set
		}

		if (StringUtils.trimToNull(attributes.context)) {
			modifySqlContexts = StringUtils.splitAndTrim(attributes.context, ',') as Set
		}

		if (StringUtils.trimToNull(attributes.applyToRollback)) {
			modifySqlAppliedOnRollback = Boolean.valueOf(attributes.applyToRollback)
		}
	}

	protected void processChange(String name, Map attributes, value) {
		setText value

		currentChange = ChangeFactory.instance.create(name)
		if (!currentChange) {
			throw new ChangeLogParseException("Unknown Liquibase extension: $name. Are you missing a jar from your classpath?")
		}

		if (currentChange instanceof RawSQLChange) {
			currentChange.setSql currentText
		}
		else if (currentChange instanceof CreateProcedureChange) {
			currentChange.setProcedureBody currentText
		}
		else if (currentChange instanceof CreateViewChange) {
			currentChange.setSelectQuery currentText
		}
		else if (currentChange instanceof StopChange) {
			currentChange.setMessage currentText
		}
		else if (currentChange instanceof LoadDataChange || currentChange instanceof SQLFileChange) {
			if (attributes.encoding == null) {
				attributes.encoding = 'UTF-8' // default from XSD
			}
		}
		else if (currentChange instanceof GrailsChange) {
			currentChange.ctx = ctx
		}

		if (currentChange instanceof CustomChangeWrapper) {
			currentChange.setClassLoader resourceAccessor.toClassLoader()
		}

		currentChange.setChangeSet currentChangeSet
		currentChange.setResourceAccessor resourceAccessor
		setPropertiesFromAttributes currentChange, attributes
		currentChange.init()
	}

	protected void processColumn(Map attributes) {
		def column = currentChange instanceof LoadDataChange ?
			new LoadDataColumnConfig() : new ColumnConfig()

		setPropertiesFromAttributes column, attributes

		if (currentChange instanceof ChangeWithColumns) {
			currentChange.addColumn column
		}
		else {
			throw new ChangeLogParseException("Unexpected column tag for ${currentChange.getClass().name}")
		}
	}

	protected void processConstraints(Map attributes) {
		def constraints = new ConstraintsConfig()
		setPropertiesFromAttributes constraints, attributes

		ColumnConfig lastColumn
		if (currentChange instanceof ChangeWithColumns) {
			if (currentChange.columns) {
				lastColumn = currentChange.columns[-1]
			}
		}
		else {
			throw new ChangeLogParseException("Unexpected change: ${currentChange.getClass().name}")
		}

		if (!lastColumn) {
			throw new ChangeLogParseException('Could not determine column to add constraint to')
		}

		lastColumn.setConstraints constraints
	}

	protected void processParam(Map attributes) {
		if (currentChange instanceof CustomChangeWrapper) {
			if (attributes.value == null) {
				currentParamName = attributes.name
			}
			else {
				currentChange.setParam attributes.name, attributes.value
			}
		}
		else {
			throw new MigrationFailedException(currentChangeSet, "'param' unexpected in $name")
		}
	}

	protected void processProperty(Map attributes) {
		String context = StringUtils.trimToNull(attributes.context)
		String dbms = StringUtils.trimToNull(attributes.dbms)
		if (!StringUtils.trimToNull(attributes.file)) {
			changeLogParameters.set attributes.name, attributes.value, context, dbms
		}
		else {
			def props = new Properties()
			def propertiesStream = resourceAccessor.getResourceAsStream(attributes.file)
			if (!propertiesStream) {
				log.info "Could not open properties file $attributes.file"
			}
			else {
				props.load propertiesStream
				props.each { propName, propValue ->
					changeLogParameters.set propName.toString(), propValue.toString(), context, dbms
				}
			}
		}
	}

	@Override
	protected createNode(name) { createNode name, [:], null }

	@Override
	protected createNode(name, value) { createNode name, [:], value }

	@Override
	protected createNode(name, Map attributes) { createNode name, attributes, null }

	@Override
	protected void setParent(parent, child) { /*do nothing*/ }

	@Override
	protected void nodeCompleted(parent, name) {
		if (changeSubObjects) {
			changeSubObjects.pop()
		}
		else if (rootPrecondition) {
			if ('preConditions' == name) {
				if (!currentChangeSet) {
					databaseChangeLog.setPreconditions rootPrecondition
				}
				else {
					currentChangeSet.setPreconditions rootPrecondition
				}
				rootPrecondition = null
			}
			else if ('and' == name) {
				preconditionLogicStack.pop()
				currentPrecondition = null
			}
			else if ('or' == name) {
				preconditionLogicStack.pop()
				currentPrecondition = null
			}
			else if ('not' == name) {
				preconditionLogicStack.pop()
				currentPrecondition = null
			}
			else if ('sqlCheck' == name) {
				currentPrecondition.setSql currentText
				currentPrecondition = null
			}
			else if ('customPrecondition' == name) {
				currentPrecondition.setClassLoader resourceAccessor.toClassLoader()
				currentPrecondition = null
			}
			else if ('grailsPrecondition' == name) {
				currentPrecondition = null
			}
		}
		else if (currentChangeSet && 'rollback' == name) {
			currentChangeSet.addRollBackSQL currentText
			inRollback = false
		}
		else if (currentChange instanceof RawSQLChange && 'comment' == name) {
			currentChange.setComments currentText
			currentText = null
		}
		else if (currentChange && ('where' == name || 'whereLazy' == name)) {
			if (currentChange instanceof UpdateDataChange) {
				currentChange.setWhereClause currentText
			}
			else if (currentChange instanceof DeleteDataChange) {
				currentChange.setWhereClause currentText
			}
			else {
				throw new ChangeLogParseException("Unexpected change type: ${currentChange.getClass().name}")
			}
			currentText = null
		}
		else if (currentChange instanceof CreateProcedureChange && 'comment' == name) {
			currentChange.setComments currentText
			currentText = null
		}
		else if (currentChange instanceof CustomChangeWrapper && currentParamName != null && 'param' == name) {
			currentChange.setParam currentParamName, currentText
			currentText = null
			currentParamName = null
		}
		else if (currentChangeSet && 'comment' == name) {
			currentChangeSet.setComments currentText
			currentText = null
		}
		else if (currentChangeSet && 'changeSet' == name) {
			databaseChangeLog.addChangeSet currentChangeSet
			currentChangeSet = null
		}
		else if (currentChange && 'column' == name && currentText != null) {
			if (currentChange instanceof InsertDataChange || currentChange instanceof UpdateDataChange) {
				currentChange.columns[-1].setValue currentText
			}
			else {
				throw new ChangeLogParseException("Unexpected column with text: $currentText")
			}
			currentText = null
		}
		else if (currentChange && name == currentChange.changeMetaData.name) {
			if (inRollback) {
				currentChangeSet.addRollbackChange currentChange
			}
			else {
				currentChangeSet.addChange currentChange
			}
			currentChange = null
		}
		else if (currentChangeSet && 'validCheckSum' == name) {
			currentChangeSet.addValidCheckSum currentText
			currentText = null
		}
		else if ('modifySql' == name) {
			inModifySql = false
			modifySqlDbmsList = null
			modifySqlContexts = null
			modifySqlAppliedOnRollback = false
		}
	}

	protected void setPropertiesFromAttributes(object, Map attributes) {
		attributes.each { name, value -> setPropertyValue object, name, value }
	}

	protected void setPropertyValue(object, String name, String value) {
		value = changeLogParameters.expandExpressions(value)
		if (object instanceof CustomChangeWrapper) {
			if ('class' == name) {
				object.setClass value
			}
			else {
				object.setParam name, value
			}
		}
		else {
			ObjectUtil.setProperty object, name, value
		}
	}

	protected boolean handleIncludedChangeLog(String fileName, boolean isRelativePath, String relativeBaseFileName) {
		String lowerName = fileName.toLowerCase()

		if (lowerName.startsWith('.') || lowerName.equals('cvs')) {
			return false
		}

		if (isRelativePath) {
			// workaround for FilenameUtils.normalize() returning null for relative paths like ../conf/liquibase.xml
			String tempFile = FilenameUtils.concat(FilenameUtils.getFullPath(relativeBaseFileName), fileName)
			if (tempFile && new File(tempFile).exists()) {
				fileName = tempFile
			}
			else {
				fileName = FilenameUtils.getFullPath(relativeBaseFileName) + fileName
			}
		}

		ChangeLogParser parser
		try {
			parser = ChangeLogParserFactory.instance.getParser(fileName, resourceAccessor)
		}
		catch (LiquibaseException e) {
			log.error "$relativeBaseFileName/$fileName is not a recognized file type"
			return false
		}

		DatabaseChangeLog changeLog = parser.parse(fileName, changeLogParameters, resourceAccessor)
		PreconditionContainer preconditions = changeLog.preconditions
		if (preconditions) {
			if (!databaseChangeLog.preconditions) {
				databaseChangeLog.setPreconditions new PreconditionContainer()
			}
			databaseChangeLog.preconditions.addNestedPrecondition preconditions
		}

		changeLog.changeSets.each { databaseChangeLog.addChangeSet it }
		true
	}
}
