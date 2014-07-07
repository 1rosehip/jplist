package asset.pipeline

class AssetProcessorService {
    static transactional = false
    def grailsApplication


    /**
    * Used for serving assets in development mode via the AssetController
    * This method is NOT recommended for public use as behavior changes in production mode.
    */
    byte[] serveAsset(uri, contentType = null, extension = null, encoding = null) {
        def assetFile = AssetHelper.fileForUri(uri, contentType, extension)

        def directiveProcessor = new DirectiveProcessor(contentType)
        if (assetFile) {
            if(assetFile.class.name == 'java.io.File') {
                return assetFile.bytes
            }
            def fileContents = directiveProcessor.compile(assetFile)
            encoding = encoding ?: assetFile.encoding
            if(encoding) {
                return fileContents.getBytes(encoding)
            } else {
                return fileContents.bytes
            }
            
        }

        return null
    }


    /**
    * Used for serving assets in development mode via the AssetController
    * This method is NOT recommended for public use as behavior changes in production mode.
    */
    def getDependencyList(uri, contentType = null, extension = null) {
        def assetFile = AssetHelper.fileForUri(uri, contentType, extension)
        def directiveProcessor = new DirectiveProcessor(contentType)
        if (assetFile) {
            return directiveProcessor.getFlattenedRequireList(assetFile)
        }
        return null
    }

    
    /**
    * Used for serving assets in development mode via the AssetController
    * This method is NOT recommended for public use as behavior changes in production mode.
    */
    byte[] serveUncompiledAsset(uri, contentType, extension = null,encoding=null) {
        def assetFile = AssetHelper.fileForUri(uri, contentType, extension)

        def directiveProcessor = new DirectiveProcessor(contentType)
        if (assetFile) {
            if(assetFile.class.name == "java.io.File") {
                return directiveProcessor.fileContents(assetFile)
            }
            if(encoding) {
                assetFile.encoding = encoding
                return directiveProcessor.fileContents(assetFile).getBytes(encoding)
            } else {
                return directiveProcessor.fileContents(assetFile).bytes
            }
            
        }

        return null
    }

    /**
     * Retrieves the asset path from the property [grails.assets.mapping] which is used by the url mapping and the
     * taglib.  The property cannot contain <code>/</code>, and must be one level deep
     *
     * @return the path
     * @throws IllegalArgumentException if the path contains <code>/</code>
     */
    String getAssetMapping() {
        def path = grailsApplication.config?.grails?.assets?.mapping ?: "assets"
        if (path.contains("/")) {
            String message = "the property [grails.assets.mapping] can only be one level" +
                    "deep.  For example, 'foo' and 'bar' would be acceptable values, but 'foo/bar' is not"
            throw new IllegalArgumentException(message)
        }

        return path
    }


}
