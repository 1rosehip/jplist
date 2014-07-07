package asset.pipeline.grails

import asset.pipeline.DirectiveProcessor
import asset.pipeline.AssetHelper
import org.codehaus.groovy.grails.core.io.DefaultResourceLocator
import org.springframework.core.io.ByteArrayResource
import org.springframework.core.io.Resource
import groovy.util.logging.Log4j

@Log4j
class AssetResourceLocator extends DefaultResourceLocator {
	public Resource findResourceForURI(String uri) {
		Resource resource = super.findResourceForURI(uri)
		if(!resource) {
			resource = findAssetForURI(uri)
		}
		return resource
	}

	public Resource findAssetForURI(String uri) {
		Resource resource
		if(warDeployed) {
			def assetUri = "assets/${uri}"
			Resource defaultResource = defaultResourceLoader.getResource(assetUri);
			if (defaultResource != null && defaultResource.exists()) {
				resource = defaultResource;
			}
		} else {
			def contentTypes = AssetHelper.assetMimeTypeForURI(uri)
			def contentType
			if(contentTypes) {
				contentType = contentTypes[0]
			}

			def extension    = AssetHelper.extensionFromURI(uri)
			def name         = AssetHelper.nameWithoutExtension(uri)
			def assetFile    = AssetHelper.fileForUri(name,contentType,extension)
			if(assetFile) {
				if(assetFile.class.name == 'java.io.File') {
					resource = new ByteArrayResource(assetFile.bytes)
				} else {
					def directiveProcessor = new DirectiveProcessor(contentType)
					def fileContents = directiveProcessor.compile(assetFile)
					def encoding = assetFile.encoding
					if(encoding) {
						resource = new ByteArrayResource(fileContents.getBytes(encoding))
					} else {
						resource = new ByteArrayResource(fileContents.bytes)
					}
				}
			}
		}
		return resource
	}
}
