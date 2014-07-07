includeTargets << grailsScript("_GrailsBootstrap")

includeTargets << new File(assetPipelinePluginDir, "scripts/_AssetCompile.groovy")

target(assetPrecompile: "Precompiles assets in the application as specified by the precompile glob!") {
  depends(configureProxy,compile, packageApp)

	if(argsMap.target) {
		event("StatusError",["This script is no longer necessary! Simply run grails war to generate your assets into your war file!"])
	} else {
		assetCompile()
	}
}

setDefaultTarget(assetPrecompile)
