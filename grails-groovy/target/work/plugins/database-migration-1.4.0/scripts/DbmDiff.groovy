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

/**
 * @author <a href='mailto:burt@burtbeckwith.com'>Burt Beckwith</a>
 */

import grails.util.Environment

import java.sql.DriverManager

import javax.sql.DataSource

import org.springframework.jndi.JndiObjectFactoryBean

includeTargets << new File("$databaseMigrationPluginDir/scripts/_DatabaseMigrationCommon.groovy")

target(dbmDiff: 'Writes description of differences to standard out') {
	depends dbmInit

	String otherEnv = argsList[0]
	if (!otherEnv) {
		errorAndDie 'You must specify the environment to diff against'
	}

	if (Environment.getEnvironment(otherEnv) == Environment.current || otherEnv == Environment.current.name) {
		errorAndDie 'You must specify a different environment than the one the script is running in'
	}

	if (!okToWrite(1, true)) return

	def thisDatabase
	def otherDatabase
	try {
		printMessage "Starting $hyphenatedScriptName against environment '$otherEnv'"

		ScriptUtils.executeAndWrite argsList[1], booleanArg('add'), dsName, { PrintStream out ->
			MigrationUtils.executeInSession(dsName) {
				thisDatabase = MigrationUtils.getDatabase(defaultSchema, dsName)
				otherDatabase = buildOtherDatabase(otherEnv)
				ScriptUtils.createAndPrintDiff thisDatabase, otherDatabase, otherDatabase, appCtx, diffTypes, out
			}
		}

		printMessage "Finished $hyphenatedScriptName"
	}
	catch (e) {
		ScriptUtils.printStackTrace e
		exit 1
	}
	finally {
		ScriptUtils.closeConnection thisDatabase?.connection
		ScriptUtils.closeConnection otherDatabase?.connection
	}
}

buildOtherDatabase = { String otherEnv ->

	try {
		// check if it's a full name
		Environment.valueOf otherEnv
	}
	catch (e) {
		// convert it from short name to full (e.g. 'dev' -> 'development')
		String fullName = Environment.getEnvironment(otherEnv)?.name
		if (fullName) {
			otherEnv = fullName
		}
	}

	def configSlurper = new ConfigSlurper(otherEnv)
	configSlurper.binding = binding.variables
	def otherDsConfig = configSlurper.parse(classLoader.loadClass('DataSource')).dataSource

	def connection

	if (otherDsConfig.jndiName) {
		def factory = new JndiObjectFactoryBean(jndiName: otherDsConfig.jndiName, expectedType: DataSource)
		factory.afterPropertiesSet()
		connection = factory.object.connection
	}
	else {
		try {
			Class.forName otherDsConfig.driverClassName, true, classLoader
		}
		catch (e) {
			errorAndDie "Driver class $otherDsConfig.driverClassName not found"
		}

		if (!otherDsConfig.url || !otherDsConfig.username) {
			errorAndDie "The comparison DataSource URL and/or username is missing, or the DataSource configuration for environment '$otherEnv' wasn't found"
		}

		String password = otherDsConfig.passwordEncryptionCodec ? resolvePassword(otherDsConfig) : otherDsConfig.password ?: null
		connection = DriverManager.getConnection(otherDsConfig.url, otherDsConfig.username, password)
	}

	MigrationUtils.getDatabase connection, defaultSchema, null
}

resolvePassword = { ds ->

	Class codecClass

	def encryptionCodec = ds.passwordEncryptionCodec
	if (encryptionCodec instanceof Class) {
		codecClass = encryptionCodec
	}
	else {
		encryptionCodec = encryptionCodec.toString()
		codecClass = grailsApp.codecClasses.find {
			it.name.equalsIgnoreCase(encryptionCodec) || it.fullName == encryptionCodec
		}?.clazz

		if (!codecClass) {
			codecClass = Class.forName(encryptionCodec, true, grailsApp.classLoader)
		}

		if (!codecClass) {
			throw new RuntimeException("Error decoding dataSource password. Codec class not found for name [$encryptionCodec]")
		}
	}

	try {
		return codecClass.decode(ds.password)
	}
	catch (ClassNotFoundException e) {
		throw new RuntimeException(
			"Error decoding dataSource password. Codec class not found for name [$encryptionCodec]: $e.message", e)
	}
	catch (e) {
		throw new RuntimeException("Error decoding dataSource password with codec [$encryptionCodec]: $e.message", e)
	}
}

setDefaultTarget dbmDiff
