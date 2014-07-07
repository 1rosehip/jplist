/*
 * Copyright 2004-2013 SpringSource.
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

import grails.util.GrailsNameUtils

/**
 * Generates a CRUD controller and matching views for a given domain class
 *
 * @author Graeme Rocher
 *
 * @since 0.4
 */

includeTargets << grailsScript("_GrailsBootstrap")
includeTargets << grailsScript("_GrailsCreateArtifacts")

generateForName = null
generateViews = true
generateController = true
generateRestfulController = false
generateAsyncController = false

target(generateForOne: "Generates controllers and views for only one domain class.") {
	depends(loadApp)

	String name = generateForName
	name = name.indexOf('.') > 0 ? name : GrailsNameUtils.getClassNameRepresentation(name)
	def domainClass = grailsApp.getDomainClass(name)

	if (!domainClass) {
		grailsConsole.updateStatus "Domain class not found in grails-app/domain, trying hibernate mapped classes..."
		bootstrap()
		domainClass = grailsApp.getDomainClass(name)
	}

	if (!domainClass) {
		event("StatusFinal", ["No domain class found for name ${name}. Please try again and enter a valid domain class name"])
		return
	}

	generateForDomainClass(domainClass)
	event("StatusFinal", ["Finished generation for domain class ${domainClass.fullName}"])
}

target(uberGenerate: "Generates controllers and views for all domain classes.") {
	depends(loadApp)

	def domainClasses = grailsApp.domainClasses

	if (!domainClasses) {
		println "No domain classes found in grails-app/domain, trying hibernate mapped classes..."
		bootstrap()
		domainClasses = grailsApp.domainClasses
	}

	if (!domainClasses) {
		event("StatusFinal", ["No domain classes found"])
		return
	}

	domainClasses.each { domainClass -> generateForDomainClass(domainClass) }
	event("StatusFinal", ["Finished generation for domain classes"])
}

void generateForDomainClass(domainClass) {
	def DefaultGrailsTemplateGenerator = classLoader.loadClass('org.codehaus.groovy.grails.scaffolding.DefaultGrailsTemplateGenerator')

	def templateGenerator = DefaultGrailsTemplateGenerator.newInstance(classLoader)
	templateGenerator.grailsApplication = grailsApp
	templateGenerator.pluginManager = pluginManager
	if (generateViews) {
		event("StatusUpdate", ["Generating views for domain class ${domainClass.fullName}"])
		templateGenerator.generateViews(domainClass, basedir)
		event("GenerateViewsEnd", [domainClass.fullName])
	}

	if (generateAsyncController ) {
		event("StatusUpdate", ["Generating controller for domain class ${domainClass.fullName}"])
		templateGenerator.generateAsyncController(domainClass, basedir)
		templateGenerator.generateAsyncTest(domainClass, "${basedir}/test/unit")
		event("GenerateControllerEnd", [domainClass.fullName])
	}
	else if (generateRestfulController) {
		event("StatusUpdate", ["Generating controller for domain class ${domainClass.fullName}"])
		templateGenerator.generateRestfulController(domainClass, basedir)
		templateGenerator.generateRestfulTest(domainClass, "${basedir}/test/unit")
		event("GenerateControllerEnd", [domainClass.fullName])
	}
	else if (generateController) {
		event("StatusUpdate", ["Generating controller for domain class ${domainClass.fullName}"])
		templateGenerator.generateController(domainClass, basedir)
		templateGenerator.generateTest(domainClass, "${basedir}/test/unit")
		event("GenerateControllerEnd", [domainClass.fullName])
	}
}
