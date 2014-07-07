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

/**
 * @author <a href='mailto:burt@burtbeckwith.com'>Burt Beckwith</a>
 */

import grails.util.GrailsNameUtils

includeTargets << grailsScript('_GrailsBootstrap')

target(dbmInit: 'General initialization, also creates a Liquibase instance') {
	depends(classpath, checkVersion, configureProxy, enableExpandoMetaClass, compile, bootstrap, loadApp)

	configureApp()

	try {
		hyphenatedScriptName = GrailsNameUtils.getScriptName(scriptName)
		MigrationUtils = classLoader.loadClass('grails.plugin.databasemigration.MigrationUtils')
		ScriptUtils = classLoader.loadClass('grails.plugin.databasemigration.ScriptUtils')

		argsList = argsMap.params
		contexts = argsMap.contexts
		diffTypes = argsMap.diffTypes
		defaultSchema = argsMap.defaultSchema
		dataSourceSuffix = argsMap.dataSource
		dsName = MigrationUtils.dataSourceNameWithSuffix(dataSourceSuffix)

		mkdir dir: MigrationUtils.changelogLocation
	}
	catch (e) {
		ScriptUtils.printStackTrace e
		throw e
	}
}

doAndClose = { Closure c ->
	try {
		MigrationUtils.executeInSession(dsName) {
			database = MigrationUtils.getDatabase(defaultSchema, dsName)
			String changeLogFileName = MigrationUtils.getChangelogFileName(dsName)
			liquibase = MigrationUtils.getLiquibase(database, changeLogFileName)

			def dsConfig = config."$dsName"
			String dbDesc = dsConfig.jndiName ? "JNDI $dsConfig.jndiName" : "$dsConfig.username @ $dsConfig.url"
			printMessage "Starting $hyphenatedScriptName for database $dbDesc"
			c()
			printMessage "Finished $hyphenatedScriptName"
		}
	}
	catch (e) {
		ScriptUtils.printStackTrace e
		exit 1
	}
	finally {
		ScriptUtils.closeConnection database
	}
}

booleanArg = { String name ->
	argsMap[name] instanceof Boolean ? argsMap[name] : false
}

errorAndDie = { String message ->
	errorMessage "\nERROR: $message"
	exit 1
}

okToWrite = { destinationOrIndex = 0, boolean relativeToMigrationDir = false ->

	String destination
	if (destinationOrIndex instanceof Number) {
		destination = argsList[destinationOrIndex]
		if (!destination) {
			return true // stdout
		}
	}
	else {
		destination = destinationOrIndex
	}

	if (relativeToMigrationDir) {
		destination = MigrationUtils.getChangelogLocation(dsName) + '/' + destination
	}

	def file = new File(destination)
	if (!file.exists()) {
		return true
	}

	String propertyName = "file.overwrite.$file.name"
	ant.input(addProperty: propertyName, message: "$destination exists, ok to overwrite?",
	          validargs: 'y,n', defaultvalue: 'y')

	if (ant.antProject.properties."$propertyName" == 'n') {
		return false
	}

	true
}

printMessage = { String message -> event('StatusUpdate', [message]) }
errorMessage = { String message -> event('StatusError', [message]) }

calculateDate = {
	Map results = ScriptUtils.calculateDate(argsList)
	if (results.error) {
		errorAndDie results.error
	}

	binding.calculateDateFileNameIndex = results.calculateDateFileNameIndex

	results.date
}

isHibernateInstalled = { ->
	if (!pluginManager.hasGrailsPlugin('hibernate') && !pluginManager.hasGrailsPlugin('hibernate4')) {
		errorMessage "Hibernate plugin isn't installed; GORM-based scripts are not available"
		return false
	}
	true
}

target(enableExpandoMetaClass: "Calls ExpandoMetaClass.enableGlobally()") {
	ExpandoMetaClass.enableGlobally()
}
