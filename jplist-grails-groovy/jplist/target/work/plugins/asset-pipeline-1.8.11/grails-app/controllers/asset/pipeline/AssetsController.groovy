package asset.pipeline

class AssetsController {

	def assetProcessorService

    def index() {
        def uri          = params.id
        def extension    = AssetHelper.extensionFromURI(request.forwardURI)
        def contentTypes = AssetHelper.assetMimeTypeForURI(request.forwardURI)
        def encoding     = params.encoding ?: request.characterEncoding

        def format = contentTypes ? contentTypes[0] : null
        if(!format)  {
            format = servletContext.getMimeType(request.forwardURI)
        }

        if(extension && uri.endsWith(".${extension}")) {
            uri = params.id[0..(-extension.size()-2)]
        }

        def assetFile
        if(params.containsKey('compile') && params.boolean('compile') == false) {
            assetFile = assetProcessorService.serveUncompiledAsset(uri,format, extension, encoding)
        } else {
            assetFile = assetProcessorService.serveAsset(uri,format, extension, encoding)
        }
		if(assetFile) {
            response.setContentType(format)
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
            response.setHeader("Pragma", "no-cache"); // HTTP 1.0.
            response.setDateHeader("Expires", 0); // Proxies.
            if(encoding) {
                response.characterEncoding = encoding
            }


            try {
                if(format == 'text/html') {
                    render contentType: 'text/html', text: new String(assetFile)
                } else {
                    response.outputStream << assetFile
                    response.flushBuffer()
                }
            } catch(e) {
                log.debug("File Transfer Aborted (Probably by the user)",e)
            }
        }
        else {
            render status: 404
        }
    }
}
