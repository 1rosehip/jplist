// sets the scriptName so we know if we can automigrate
eventPackageAppEnd = {
	try {
		def MigrationUtils = classLoader.loadClass('grails.plugin.databasemigration.MigrationUtils')
		MigrationUtils.scriptName = binding.variables.scriptName
	}
	catch (Throwable t) {
		println "\nERROR setting MigrationUtils.scriptName, auto-migrate not possible: $e.message\n"
	}
}

// copies migration files to the classpath so they'll be available for automigration
eventCreateWarStart = { name, stagingDir ->

	def conf = config.grails.plugin.databasemigration
	String changelogLocation = conf.changelogLocation ?: 'grails-app/migrations'
	if (!new File(changelogLocation).exists()) {
		return
	}

	File classesDir = new File(stagingDir, 'WEB-INF/classes/migrations')
	classesDir.mkdirs()

	ant.copy(todir: classesDir.path, verbose: true) {
		fileset dir: changelogLocation
	}
}
