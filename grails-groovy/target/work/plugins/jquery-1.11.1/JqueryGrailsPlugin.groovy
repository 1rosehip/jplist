/*
 * Copyright 2007-2009 the original author or authors.
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

import grails.util.Environment

import org.codehaus.groovy.grails.plugins.jquery.JQueryConfig
import org.codehaus.groovy.grails.plugins.jquery.JQueryProvider
import org.codehaus.groovy.grails.plugins.web.taglib.JavascriptTagLib

class JqueryGrailsPlugin {
	// Only change the point release. Edit o.c.g.g.o.j.JQueryConfig.SHIPPED_VERSION when changing jQuery resource version
	// This should match JQueryConfig.SHIPPED_VERSION but must be a literal here due to how AstPluginDescriptorReader parses this file
	def version = "1.11.1"

	static SHIPPED_SRC_DIR = 'jquery'

	def grailsVersion = "1.3 > *"

	def pluginExcludes = [
		'docs/**',
		'src/docs/**'
	]

	def title = "jQuery for Grails"
	def description = "Provides integration for the jQuery library with Grails JavascriptProvider"
	def documentation = "http://grails.org/plugin/jquery"
	def license = "APACHE"
	def issueManagement = [ system: "JIRA", url: "http://jira.grails.org/browse/GPJQUERY" ]
	def scm = [ url: "https://github.com/gpc/grails-jquery" ]
	def organization = [ name: "Grails Plugin Collective", url: "http://github.com/gpc" ]
	def developers = [
		[name: "Sergey Nebolsin", email: "nebolsin@gmail.com"],
		[name: "Craig Jones", email: "craigjones@maximsc.com"],
		[name: "Marc Palmer", email: "marc@grailsrocks.com"],
		[name: "Finn Herpich", email: "finn.herpich@marfinn-software.de"]
	]

	static jQueryVersion
	static jQuerySources

	def doWithSpring = {
		jQueryConfig(JQueryConfig)
	}

	private void loadConfig(application) {
		GroovyClassLoader classLoader = new GroovyClassLoader(getClass().getClassLoader())
		def confClass
		try {
			confClass = classLoader.loadClass('JQueryConfig')
		} catch (Exception e) {
			// <gulp>
		}
		ConfigObject config = confClass ? new ConfigSlurper(Environment.current.name).parse(confClass).merge(application.config) : application.config

		JqueryGrailsPlugin.jQueryVersion = config.jquery.version instanceof String ? config.jquery.version : JQueryConfig.SHIPPED_VERSION
		JqueryGrailsPlugin.jQuerySources = config.jquery.sources instanceof String ? config.jquery.sources : JqueryGrailsPlugin.SHIPPED_SRC_DIR
	}

	def doWithApplicationContext = { applicationContext ->
		// We need to init our own config first
		loadConfig(application)

		if (Environment.isDevelopmentMode()) {
			JavascriptTagLib.LIBRARY_MAPPINGS.jquery = ["${JqueryGrailsPlugin.jQuerySources}/jquery-${JqueryGrailsPlugin.jQueryVersion}"]
		} else {
			JavascriptTagLib.LIBRARY_MAPPINGS.jquery = ["${JqueryGrailsPlugin.jQuerySources}/jquery-${JqueryGrailsPlugin.jQueryVersion}.min"]
		}

		def jQueryConfig = applicationContext.jQueryConfig
		jQueryConfig.init()

		if (jQueryConfig.defaultPlugins) {
			jQueryConfig.defaultPlugins.each { pluginName ->
				jQueryConfig.plugins."$pluginName".each {fileName ->
					JavascriptTagLib.LIBRARY_MAPPINGS.jquery += ["${JqueryGrailsPlugin.jQuerySources}/${fileName}"[0..-4]]
				}
			}
		}

		JavascriptTagLib.PROVIDER_MAPPINGS.jquery = JQueryProvider
	}
}
