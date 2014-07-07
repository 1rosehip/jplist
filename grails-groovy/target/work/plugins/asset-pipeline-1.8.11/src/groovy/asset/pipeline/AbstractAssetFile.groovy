package asset.pipeline

abstract class AbstractAssetFile implements AssetFile {
	File file
	AssetFile baseFile
	String encoding

	String processedStream(precompiler) {
		def fileText
		def skipCache = precompiler ?: (!processors || processors.size() == 0)

		if(baseFile?.encoding || encoding) {
			fileText = file?.getText(baseFile?.encoding ? baseFile.encoding : encoding)
		} else {
			fileText = file?.text
		}

		def md5 = AssetHelper.getByteDigest(fileText.bytes)
		if(!skipCache) {
			def cache = CacheManager.findCache(file.canonicalPath, md5)
			if(cache) {
				return cache
			}
		}
		for(processor in processors) {
			def processInstance = processor.newInstance(precompiler)
			fileText = processInstance.process(fileText, this)
		}

		if(!skipCache) {
			CacheManager.createCache(file.canonicalPath,md5,fileText)
		}

		return fileText
	}
}
