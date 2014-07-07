package asset.pipeline

import javax.servlet.*
import org.springframework.web.context.support.WebApplicationContextUtils
import grails.util.Environment
import groovy.util.logging.Log4j

@Log4j
class AssetPipelineFilter implements Filter {
    def applicationContext
    def servletContext
    void init(FilterConfig config) throws ServletException {
        applicationContext = WebApplicationContextUtils.getWebApplicationContext(config.servletContext)
        servletContext = config.servletContext
        // permalinkService = applicationContext['spudPermalinkService']
    }

    void destroy() {
    }

    void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        def mapping = applicationContext.assetProcessorService.assetMapping

        def fileUri = request.requestURI
        def baseAssetUrl = request.contextPath == "/" ? "/$mapping" : "${request.contextPath}/${mapping}"
        if(fileUri.startsWith(baseAssetUrl)) {
            fileUri = fileUri.substring(baseAssetUrl.length())
        }

        def file = applicationContext.getResource("assets${fileUri}")
        if (file.exists()) {
            if(checkETag(request, response, fileUri)) {
                // Check for GZip
                def acceptsEncoding = request.getHeader("Accept-Encoding")
                if(acceptsEncoding?.split(",")?.contains("gzip")) {
                    def gzipFile = applicationContext.getResource("assets${fileUri}.gz")
                    if(gzipFile.exists()) {
                        file = gzipFile
                        response.setHeader('Content-Encoding','gzip')
                    }
                }
                def format = servletContext.getMimeType(request.forwardURI)
                def encoding = request.getCharacterEncoding()
                if(encoding) {
                    response.setCharacterEncoding(encoding)
                }
                response.setContentType(format)
                response.setHeader('Vary', 'Accept-Encoding')
                response.setHeader('Cache-Control','public, max-age=31536000')

                try {
                    response.outputStream << file.inputStream.getBytes()
                    response.flushBuffer()
                } catch(e) {
                    log.debug("File Transfer Aborted (Probably by the user)",e)
                }
            }

        }

        if (!response.committed) {
            chain.doFilter(request, response)
        }
    }

    /**
    * Here we check if the request is contingent upon an ETag and if not, we append the ETag to the header key.
    * This ETag is essentially the digested file name as it is unique unless the file changes.
    * @return Wether processing should continue or not
    */
    Boolean checkETag(ServletRequest request, ServletResponse response, fileUri) {
        def manifestPath = fileUri
        if(fileUri.startsWith('/')) {
            manifestPath = fileUri.substring(1) //Omit forward slash
        }

        def etagName = manifestPath
        def manifest = applicationContext.grailsApplication.config.grails.assets.manifest
        if(manifest) {
            def digestedName = manifest.getProperty(manifestPath)
            if(digestedName) {
                etagName = manifestPath
            }
        }
        def ifNoneMatchHeader = request.getHeader('If-None-Match')
        if(ifNoneMatchHeader && ifNoneMatchHeader == etagName) {
            response.status = 304
            response.flushBuffer()
            return false
        }
        response.setHeader('ETag',etagName)
        return true
    }

}
