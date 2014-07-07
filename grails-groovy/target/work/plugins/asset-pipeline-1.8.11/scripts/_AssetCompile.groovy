import org.apache.tools.ant.DirectoryScanner

// import asset.pipeline.*
includeTargets << grailsScript("_PackagePlugins")
includeTargets << grailsScript("_GrailsBootstrap")

target(assetClean: "Cleans Compiled Assets Directory") {
	// Clear compiled assets folder
	println "Asset Precompiler Args ${argsMap}"
  def assetDir = new File(argsMap.target ?: "target/assets")
  if(assetDir.exists()) {
  	assetDir.deleteDir()
  }
}

target(assetCompile: "Precompiles assets in the application as specified by the precompile glob!") {
  depends(configureProxy,compile)

  def assetHelper             = classLoader.loadClass('asset.pipeline.AssetHelper')
  def assetCompilerClass      = classLoader.loadClass('asset.pipeline.AssetCompiler')
  def directiveProcessorClass = classLoader.loadClass('asset.pipeline.DirectiveProcessor')
  def assetConfig             = [specs:[]] //Additional Asset Specs (Asset File formats) that we want to process.
  event("AssetPrecompileStart", [assetConfig])
  assetConfig.minifyJs = config.grails.assets.containsKey('minifyJs') ? config.grails.assets.minifyJs : (argsMap.containsKey('minifyJs') ? argsMap.minifyJs == 'true' : true)
  assetConfig.minifyCss = config.grails.assets.containsKey('minifyCss') ? config.grails.assets.minifyCss : (argsMap.containsKey('minifyCss') ? argsMap.minifyCss == 'true' : true)
  assetConfig.minifyOptions = config.grails.assets.minifyOptions
  assetConfig.compileDir = "target/assets"
  assetConfig.excludesGzip = config.grails.assets.excludesGzip


  event("StatusUpdate",["Precompiling Assets!"])

  def assetCompiler = assetCompilerClass.newInstance(assetConfig, eventListener)

  assetCompiler.assetPaths = assetHelper.getAssetPathsByPlugin()
  assetCompiler.excludeRules.default = config.grails.assets.excludes
  assetCompiler.includeRules.default = config.grails.assets.includes

	// Initialize Exclude/Include Rules
  config.grails.assets.plugin.each { pluginName, value ->

  	if(value.excludes) {
  		assetCompiler.excludeRules[pluginName] = value.excludes
  	}
  	if(value.includes) {
  		assetCompiler.includeRules[pluginName] = value.includes
  	}
  }
  assetCompiler.compile()
}

