

eventCreateWarStart = {warName, stagingDir ->
	includeTargets << new File(assetPipelinePluginDir, "scripts/_AssetCompile.groovy")
	assetCompile()

	def assetCompileDir = new File(basedir, "target/assets")
	def assetPathDir = new File(stagingDir, 'assets')
	assetPathDir.mkdirs()

	ant.copy(todir:assetPathDir.path, verbose:true) {
		fileset dir:assetCompileDir
	}
}

eventCleanStart = {
    Ant.delete('dir':'target/assets')
}