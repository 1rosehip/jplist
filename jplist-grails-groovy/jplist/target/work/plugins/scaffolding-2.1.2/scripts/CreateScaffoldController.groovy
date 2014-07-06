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

/**
 * Creates a new Grails dynamic scaffolding controller for given domain classes.
 *
 * @author Graeme Rocher
 *
 * @since 0.4
 */

includeTargets << grailsScript("_GrailsCreateArtifacts")

target (createScaffoldController: "Creates a new scaffolding controller for a domain class") {
	depends(checkVersion, parseArguments)

	String suffix = "Controller"
	promptForName(type: "Domain Class")

	for (name in argsMap["params"]) {
		name = purgeRedundantArtifactSuffix(name, suffix)

		// Does the corresponding domain class exist?
		def dcFile = new File("${basedir}/grails-app/domain", name.replace('.' as char, '/' as char) + ".groovy")
		if (!dcFile.exists()) {
			grailsConsole.error "No domain class found for '$name'"
			return
		}

		createArtifact(
			name: name,
			suffix: suffix,
			type: "ScaffoldingController",
			path: "grails-app/controllers",
			skipPackagePrompt: true)

		String viewsDir = "${basedir}/grails-app/views/${propertyName}"
		ant.mkdir(dir:viewsDir)
		event("CreatedFile", [viewsDir])

		createUnitTest(name: name, suffix: suffix, superClass: "ControllerUnitTestCase", skipPackagePrompt: true)
	}
}

USAGE = """
    create-scaffold-controller [NAME]

where
    NAME       = The name, including package, of the domain class to create
				 a scaffolded controller for. If not provided, this
                 command will ask you for the name.
"""

setDefaultTarget 'createScaffoldController'
