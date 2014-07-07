package asset.pipeline

import grails.util.Environment

class AssetsTagLib {

	static namespace = "asset"
	static returnObjectForTags = ['assetPath']

	def grailsApplication
	def assetProcessorService

	/**
	 * @attr src REQUIRED
	 */
	def javascript = { attrs ->
		def src = attrs.remove('src')
		attrs.remove('href')
		src = "${AssetHelper.nameWithoutExtension(src)}.js"
		def uri
		def extension

		def conf = grailsApplication.config.grails.assets
		def debugParameter = params."_debugResources" == 'y' || params."_debugAssets" == "y"
		def debugMode = (conf.allowDebugParam && debugParameter) ||  (Environment.current == Environment.DEVELOPMENT && !grailsApplication.warDeployed && conf.bundle != true)

		if(!debugMode) {
			out << "<script src=\"${assetPath(src:src)}\" type=\"text/javascript\" ${paramsToHtmlAttr(attrs)}></script>"
		} else {
			if (src.lastIndexOf(".") >= 0) {
				uri = src.substring(0, src.lastIndexOf("."))
				extension = src.substring(src.lastIndexOf(".") + 1)
			} else {
				uri = src
				extension = 'js'
			}
			// def startTime = new Date().time
			def list = assetProcessorService.getDependencyList(uri, 'application/javascript', extension)
			def modifierParams = ["compile=false"]
			if(attrs.charset) {
				modifierParams << "encoding=${attrs.charset}"
			}
			list.each { dep ->
				def depAssetPath = assetPath([src: "${dep.path}", ignorePrefix:true])
				out << "<script src=\"${depAssetPath}?${modifierParams.join("&")}\" type=\"text/javascript\" ${paramsToHtmlAttr(attrs)}></script>"
			}
			// println "Fetching Dev Mode Dependency List Time ${new Date().time - startTime}"
		}
	}

	/**
	 * @attr href OPTIONAL alternative to src
	 * @attr src OPTIONAL alternative to href
	 */
	def stylesheet = { attrs ->
		def src  = attrs.remove('src')
		def href = attrs.remove('href')
		if(href) {
			src = href
		}
		src = "${AssetHelper.nameWithoutExtension(src)}.css"
		def conf = grailsApplication.config.grails.assets
		def uri
		def extension
		def debugParameter = params."_debugResources" == 'y' || params."_debugAssets" == "y"
	    def debugMode = (conf.allowDebugParam && debugParameter) ||  (Environment.current == Environment.DEVELOPMENT && !grailsApplication.warDeployed && conf.bundle != true)

		if(!debugMode) {
			out << link([rel: 'stylesheet', href:src] + attrs)
		} else {
			if (src.lastIndexOf(".") >= 0) {
				uri = src.substring(0, src.lastIndexOf("."))
				extension = src.substring(src.lastIndexOf(".") + 1)
			} else {
				uri = src
				extension = 'css'
			}
			def list = assetProcessorService.getDependencyList(uri, 'text/css', extension)
			def modifierParams = ["compile=false"]
			if(attrs.charset) {
				modifierParams << "encoding=${attrs.charset}"
			}
			list.each { dep ->
				def depAssetPath = assetPath([src: "${dep.path}", ignorePrefix:true])
				out << "<link rel=\"stylesheet\" href=\"${depAssetPath}?${modifierParams.join("&")}\" ${paramsToHtmlAttr(attrs)} />"
			}
		}
	}

	def image = { attrs ->
		def src = attrs.remove('src')
		out << "<img src=\"${assetPath(src:src)}\" ${paramsToHtmlAttr(attrs)}/>"
	}


	/**
	 * @attr href REQUIRED
	 * @attr rel REQUIRED
	 * @attr type OPTIONAL
	 */
	def link = { attrs ->
		def href = attrs.remove('href')
		out << "<link ${paramsToHtmlAttr(attrs)} href=\"${assetPath(src:href)}\"/>"
	}


	def script = { attrs, body ->
		def assetBlocks = request.getAttribute('assetScriptBlocks')
		if(!assetBlocks) {
			assetBlocks = []
		}
		assetBlocks << [attrs: attrs, body: body()]
		request.setAttribute('assetScriptBlocks', assetBlocks)
	}

	def deferredScripts = { attrs ->
		def assetBlocks = request.getAttribute('assetScriptBlocks')
		if(!assetBlocks) {
			return
		}
		assetBlocks.each { assetBlock ->
			out << "<script ${paramsToHtmlAttr(assetBlock.attrs)}>${assetBlock.body}</script>"
		}
	}


	def assetPath = { attrs ->
		g.assetPath(attrs)
	}

	def assetPathExists = { attrs, body ->
		def src = attrs.remove('src')
		def exists = isAssetPath(src)
            if (exists){
                out << (body() ?: true)
            } else {
                out << ''
            } 
    }

	def isAssetPath(src) {
		def conf = grailsApplication.config.grails.assets
		if(conf.precompiled) {
			def realPath = conf.manifest.getProperty(src)
			if(realPath) {
				return true
			}
		} else {
			def assetFile = AssetHelper.fileForFullName(src)
			if(assetFile != null) {
				return true
			}
		}
		return false
	}
	
	private paramsToHtmlAttr(attrs) {
		attrs.collect { key, value -> "${key}=\"${value.toString().replace('\'', '\\\'')}\"" }?.join(" ")
	}

}
