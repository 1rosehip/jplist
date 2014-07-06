package asset.pipeline
import org.apache.tools.ant.DirectoryScanner
import groovy.util.logging.Log4j
import asset.pipeline.processors.UglifyJsProcessor
import asset.pipeline.processors.CssMinifyPostProcessor
@Log4j
class AssetCompiler {
	def includeRules = [:]
	def excludeRules = [:]
	def assetPaths = [:]
	def options = [:]
	def eventListener
	def filesToProcess = []
	Properties manifestProperties

	AssetCompiler(options=[:], eventListener = null) {
		this.eventListener = eventListener
		this.options = options
		if(!options.compileDir) {
			options.compileDir = "target/assets"
		}
		if(!options.excludesGzip) {
			options.excludesGzip = ['png', 'jpg','jpeg', 'gif', 'zip', 'gz']
		} else {
			options.excludesGzip += ['png', 'jpg','jpeg', 'gif', 'zip', 'gz']
		}
		// Load in additional assetSpecs
		options.specs?.each { spec ->
			def specClass = this.class.classLoader.loadClass(spec)
			if(specClass) {
				AssetHelper.assetSpecs += specClass
			}
		}
		manifestProperties = new Properties()
	}

	void compile() {
		def assetDir           = initializeWorkspace()
		def uglifyJsProcessor  = new UglifyJsProcessor()
		def minifyCssProcessor = new CssMinifyPostProcessor()

		filesToProcess = this.getAllAssets()
		// Lets clean up assets that are no longer being compiled
		removeDeletedFiles(filesToProcess)

		for(int index = 0 ; index < filesToProcess.size() ; index++) {
			def fileName = filesToProcess[index]
			eventListener?.triggerEvent("StatusUpdate", "Processing File ${index+1} of ${filesToProcess.size()} - ${fileName}")

			def digestName
			def isUnchanged = false
			def assetFile   = AssetHelper.assetForFile(AssetHelper.fileForUri(filesToProcess[index],null,null))
			def extension   = AssetHelper.extensionFromURI(fileName)
			fileName        = AssetHelper.nameWithoutExtension(fileName)

			if(assetFile) {
				def fileData
				if(assetFile.class.name != 'java.io.File') {
					if(assetFile.compiledExtension) {
						extension = assetFile.compiledExtension
						fileName = AssetHelper.fileNameWithoutExtensionFromArtefact(fileName,assetFile)
					}
					def contentType = (assetFile.contentType instanceof String) ? assetFile.contentType : assetFile.contentType[0]
					def directiveProcessor = new DirectiveProcessor(contentType, this)
					fileData   = directiveProcessor.compile(assetFile)
					digestName = AssetHelper.getByteDigest(fileData.bytes)
					def fileNameUri = fileName.replaceAll(AssetHelper.QUOTED_FILE_SEPARATOR, AssetHelper.DIRECTIVE_FILE_SEPARATOR)
					def existingDigestFile = manifestProperties.getProperty("${fileNameUri}.${extension}")
					if(existingDigestFile && existingDigestFile == "${fileNameUri}-${digestName}.${extension}") {
						isUnchanged=true
					}

					if(fileName.indexOf(".min") == -1 && contentType == 'application/javascript' && options.minifyJs && !isUnchanged) {
						def newFileData = fileData
						try {
							eventListener?.triggerEvent("StatusUpdate", "Uglifying File ${index+1} of ${filesToProcess.size()} - ${fileName}")
							newFileData = uglifyJsProcessor.process(fileData, options.minifyOptions ?: [:])
						} catch(e) {
							log.error("Uglify JS Exception", e)
							newFileData = fileData
						}
						fileData = newFileData
					} else if(fileName.indexOf(".min") == -1 && contentType == 'text/css' && options.minifyCss && !isUnchanged) {
						def newFileData = fileData
						try {
							eventListener?.triggerEvent("StatusUpdate", "Minifying File ${index+1} of ${filesToProcess.size()} - ${fileName}")
							newFileData = minifyCssProcessor.process(fileData)
						} catch(e) {
							log.error("Minify CSS Exception", e)
							newFileData = fileData
						}
						fileData = newFileData
					}

					if(assetFile.encoding) {
						fileData = fileData.getBytes(assetFile.encoding)
					} else {
						fileData = fileData.bytes
					}

				} else {
					digestName = AssetHelper.getByteDigest(assetFile.bytes)
					def existingDigestFile = manifestProperties.getProperty("${fileName}.${extension}")
					if(existingDigestFile && existingDigestFile == "${fileName}-${digestName}.${extension}") {
						isUnchanged=true
					}
				}

				if(!isUnchanged) {
					def outputFileName = fileName
					if(extension) {
						outputFileName = "${fileName}.${extension}"
					}
					def outputFile = new File(options.compileDir, "${outputFileName}")

					def parentTree = new File(outputFile.parent)
					parentTree.mkdirs()
					outputFile.createNewFile()

					if(fileData) {
						def outputStream = outputFile.newOutputStream()
						outputStream.write(fileData, 0 , fileData.length)
						outputStream.flush()
						outputStream.close()
					} else {
						if(assetFile.class.name == 'java.io.File') {
							AssetHelper.copyFile(assetFile, outputFile)
						} else {
							AssetHelper.copyFile(assetFile.file, outputFile)
							digestName = AssetHelper.getByteDigest(assetFile.file.bytes)
						}
					}

					if(extension) {
						try {

							def digestedFile = new File(options.compileDir,"${fileName}-${digestName}${extension ? ('.' + extension) : ''}")
							digestedFile.createNewFile()
							AssetHelper.copyFile(outputFile, digestedFile)
							def fileNameUri = fileName.replaceAll(AssetHelper.QUOTED_FILE_SEPARATOR, AssetHelper.DIRECTIVE_FILE_SEPARATOR)
							manifestProperties.setProperty("${fileNameUri}.${extension}", "${fileNameUri}-${digestName}${extension ? ('.' + extension) : ''}")

							// Zip it Good!
							if(!options.excludesGzip.find{ it.toLowerCase() == extension.toLowerCase()}) {
								eventListener?.triggerEvent("StatusUpdate","Compressing File ${index+1} of ${filesToProcess.size()} - ${fileName}")
								createCompressedFiles(outputFile, digestedFile)
							}


						} catch(ex) {
							log.error("Error Compiling File ${fileName}.${extension}",ex)
						}
					}
				}

			}

		}

		saveManifest()
		eventListener?.triggerEvent("StatusUpdate","Finished Precompiling Assets")

  }

  private initializeWorkspace() {
		 // Check for existing Compiled Assets
	  def assetDir = new File(options.compileDir)
	  if(assetDir.exists()) {
		def manifestFile = new File(options.compileDir,"manifest.properties")
		if(manifestFile.exists())
			manifestProperties.load(manifestFile.newDataInputStream())
	  } else {
		assetDir.mkdirs()
	  }
	  return assetDir
  }

	void addPaths(String key, paths) {
		// If key is not specified, group with "application"
		def assetPath = assetPaths[key ?: 'application'] ?: []
		if(paths instanceof String) {
			paths = [paths]
		}
		assetPath += paths
		assetPath.unique()
		assetPaths[key ?: 'application'] = assetPath

	}

	void removePathsByKey(String key) {
		assetPaths.remove(key)
	}

	def getIncludesForPathKey(String key) {
		def includes = []
		def defaultIncludes = includeRules.default
		if(defaultIncludes) {
			includes += defaultIncludes
		}
		if(includeRules[key]) {
			includes += includeRules[key]
		}
		return includes.unique()
	}

	def getExcludesForPathKey(String key) {
		def excludes = ["**/.*","**/.DS_Store", 'WEB-INF/**/*', '**/META-INF/*', '**/_*.*','**/.svn/**']
		def defaultExcludes = excludeRules.default
		if(defaultExcludes) {
			excludes += defaultExcludes
		}
		if(excludeRules[key]) {
			excludes += excludeRules[key]
		}
		return excludes.unique()
	}


	def getAllAssets() {
		DirectoryScanner scanner = new DirectoryScanner()
		def assetPaths           = assetPaths
		def filesToProcess       = []

		assetPaths.each { key, value ->
			scanner.setExcludes(getExcludesForPathKey(key) as String[])
			scanner.setIncludes(["**/*"] as String[])
			for(path in value) {
			scanner.setBasedir(path)
			scanner.setCaseSensitive(false)
			scanner.scan()
			filesToProcess += scanner.getIncludedFiles().flatten()
			}

			scanner.setExcludes([] as String[])
			def includes = getIncludesForPathKey(key)
			if(includes.size() > 0) {
				scanner.setIncludes(includes as String[])
				for(path in value) {
				scanner.setBasedir(path)
				scanner.setCaseSensitive(false)
				scanner.scan()
				filesToProcess += scanner.getIncludedFiles().flatten()
				}
			}

		}

		filesToProcess.unique()

		return filesToProcess //Make sure we have a unique set
	}

	private saveManifest() {
		// Update Manifest
		def manifestFile = new File(options.compileDir,'manifest.properties')
		manifestProperties.store(manifestFile.newWriter(),"")
	}

	private createCompressedFiles(outputFile, digestedFile) {
		def targetStream  = new java.io.ByteArrayOutputStream()
		def zipStream     = new java.util.zip.GZIPOutputStream(targetStream)
		def zipFile       = new File("${outputFile.getAbsolutePath()}.gz")
		def zipFileDigest = new File("${digestedFile.getAbsolutePath()}.gz")

		zipStream.write(outputFile.bytes)
		zipFile.createNewFile()
		zipFileDigest.createNewFile()
		zipStream.finish()

		zipFile.bytes = targetStream.toByteArray()
		AssetHelper.copyFile(zipFile, zipFileDigest)
		targetStream.close()
	}

	private removeDeletedFiles(filesToProcess) {
		def compiledFileNames = filesToProcess.collect { fileToProcess ->
			def fileName    = fileToProcess
			def extension   = AssetHelper.extensionFromURI(fileName)
			fileName        = AssetHelper.nameWithoutExtension(fileName)
			def assetFile   = AssetHelper.assetForFile(AssetHelper.fileForUri(fileToProcess,null,null))
			if(assetFile && assetFile.class.name != 'java.io.File' && assetFile.compiledExtension) {
				extension = assetFile.compiledExtension
				fileName = AssetHelper.fileNameWithoutExtensionFromArtefact(fileName,assetFile)
			}
			return "${fileName}.${extension}"
		}

		def propertiesToRemove = []
		manifestProperties.keySet().each { compiledUri ->
			def compiledName = 	compiledUri.replace(AssetHelper.DIRECTIVE_FILE_SEPARATOR,File.separator)						

			def fileFound = compiledFileNames.find{ it == compiledName.toString()}
			if(!fileFound) {
				def digestedUri = manifestProperties.getProperty(compiledName)
				def digestedName = digestedUri.replace(AssetHelper.DIRECTIVE_FILE_SEPARATOR,File.separator)						
				def compiledFile = new File(options.compileDir, compiledName)
				def digestedFile = new File(options.compileDir, digestedName)
				def zippedFile = new File(options.compileDir, "${compiledName}.gz")
				def zippedDigestFile = new File(options.compileDir, "${digestedName}.gz")
				if(compiledFile.exists()) {
					compiledFile.delete()
				}
				if(digestedFile.exists()) {
					digestedFile.delete()
				}
				if(zippedFile.exists()) {
					zippedFile.delete()
				}
				if(zippedDigestFile.exists()) {
					zippedDigestFile.delete()
				}
				propertiesToRemove << compiledName
			}
		}

		propertiesToRemove.each {
			manifestProperties.remove(it)
		}
	}

}
