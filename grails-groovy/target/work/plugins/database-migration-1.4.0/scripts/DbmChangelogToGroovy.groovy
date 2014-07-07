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

includeTargets << new File("$databaseMigrationPluginDir/scripts/_DatabaseMigrationCommon.groovy")

target(dbmChangelogToGroovy: 'Creates a Groovy DSL changelog from a Liquibase XML file') {
	depends dbmInit

	String xml = argsList[0]
	if (!xml) {
		errorAndDie "Must specify the source XML file path"
	}

	String groovy = argsList[1] ?: argsList[0][0..-4] + 'groovy'

	if (!okToWrite(groovy)) return

	printMessage "Converting $xml to $groovy"

	ChangelogXml2Groovy = classLoader.loadClass('grails.plugin.databasemigration.ChangelogXml2Groovy')
	new File(groovy).withWriter { it.write ChangelogXml2Groovy.convert(new File(xml).text) }
}

setDefaultTarget dbmChangelogToGroovy
