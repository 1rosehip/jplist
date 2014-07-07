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

import grails.util.GrailsUtil
import liquibase.changelog.ChangeLogParameters
import liquibase.changelog.DatabaseChangeLog
import liquibase.exception.ChangeLogParseException
import liquibase.parser.ChangeLogParser
import liquibase.resource.ResourceAccessor

import org.codehaus.groovy.control.CompilerConfiguration
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.context.ApplicationContext

/**
 * Loads a DSL script and invokes the builder. Registered in
 * DatabaseMigrationGrailsPlugin.doWithApplicationContext().
 *
 * @author <a href='mailto:burt@burtbeckwith.com'>Burt Beckwith</a>
 */
class GrailsChangeLogParser implements ChangeLogParser {

	protected Logger log = LoggerFactory.getLogger(getClass())

	protected ApplicationContext ctx

	/**
	 * Constructor.
	 * @param ctx the Spring app context
	 */
	GrailsChangeLogParser(ApplicationContext ctx) {
		this.ctx = ctx
	}

	/**
	 * {@inheritDoc}
	 * @see liquibase.parser.ChangeLogParser#parse(java.lang.String, liquibase.changelog.ChangeLogParameters,
	 * 	liquibase.resource.ResourceAccessor)
	 */
	DatabaseChangeLog parse(String physicalChangeLogLocation,
			ChangeLogParameters changeLogParameters,
			ResourceAccessor resourceAccessor) throws ChangeLogParseException {

		try {
			log.debug "parsing $physicalChangeLogLocation"

			def inputStream = resourceAccessor.getResourceAsStream(physicalChangeLogLocation)
			if (!inputStream) {
				throw new ChangeLogParseException("$physicalChangeLogLocation not found")
			}

			CompilerConfiguration config = new CompilerConfiguration(CompilerConfiguration.DEFAULT)
			if (config.metaClass.respondsTo(config, 'setDisabledGlobalASTTransformations')) {
				Set disabled = config.disabledGlobalASTTransformations ?: []
				disabled << 'org.grails.datastore.gorm.query.transform.GlobalDetachedCriteriaASTTransformation'
				config.disabledGlobalASTTransformations = disabled
			}

			GroovyClassLoader cl = new GroovyClassLoader(Thread.currentThread().contextClassLoader, config, false)
			Script script = new GroovyShell(cl, new Binding(MigrationUtils.changelogProperties), config).parse(inputStream.text)
			script.run()

			setChangelogProperties changeLogParameters

			def builder = new DslBuilder(changeLogParameters, resourceAccessor,
				physicalChangeLogLocation, ctx)

			def root = script.databaseChangeLog
			root.delegate = builder
			root()

			builder.databaseChangeLog
		}
		catch(e) {
			println "problem parsing $physicalChangeLogLocation: $e.message (re-run with --verbose to see the stacktrace)"
			throw GrailsUtil.deepSanitize(e)
		}
	}

	boolean supports(String changeLogFile, ResourceAccessor resourceAccessor) {
		changeLogFile.toLowerCase().endsWith 'groovy'
	}

	int getPriority() { PRIORITY_DEFAULT }

	protected void setChangelogProperties(ChangeLogParameters changeLogParameters) {

		MigrationUtils.changelogProperties.each { name, value ->

			String contexts
			String databases
			if (value instanceof Map) {
				contexts = value.contexts
				databases = value.databases
				value = value.value
			}

			changeLogParameters.set name, value, contexts, databases
		}
	}
}
