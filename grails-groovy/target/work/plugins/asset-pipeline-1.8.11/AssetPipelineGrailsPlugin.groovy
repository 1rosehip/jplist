/*
 * Copyright 2014 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import grails.util.Environment
import grails.plugin.webxml.FilterManager
import asset.pipeline.grails.LinkGenerator
import asset.pipeline.grails.CachingLinkGenerator
import asset.pipeline.grails.AssetResourceLocator


class AssetPipelineGrailsPlugin {
    def version         = "1.8.11"
    def grailsVersion   = "2.0 > *"
    def title           = "Asset Pipeline Plugin"
    def author          = "David Estes"
    def authorEmail     = "destes@bcap.com"
    def description     = 'The Asset-Pipeline is a plugin used for managing and processing static assets in Grails applications. Asset-Pipeline functions include processing and minification of both CSS and JavaScript files. It is also capable of being extended to compile custom static assets, such as CoffeeScript.'
    def documentation   = "http://bertramdev.github.io/asset-pipeline"
    def license         = "APACHE"
    def organization    = [ name: "Bertram Capital", url: "http://www.bertramcapital.com/" ]
    def issueManagement = [ system: "GITHUB", url: "http://github.com/bertramdev/asset-pipeline/issues" ]
    def scm             = [ url: "http://github.com/bertramdev/asset-pipeline" ]
    def pluginExcludes  = [
        "grails-app/assets/**",
        "test/dummy/**"
    ]
    def developers      = [ [name: 'Brian Wheeler'] ]
    def loadAfter = ['url-mappings']
    def doWithSpring = {
        def manifestProps = new Properties()
        def manifestFile
        try {
            manifestFile = application.getParentContext().getResource("assets/manifest.properties")
        } catch(e) {
            //Silent fail
        }
        if(manifestFile?.exists()) {
            try {
                manifestProps.load(manifestFile.inputStream)
                application.config.grails.assets.manifest = manifestProps

            } catch(e) {
                println "Failed to load Manifest"
            }
        }

        if(!application.config.grails.assets.containsKey("precompiled")) {
            application.config.grails.assets.precompiled = !Environment.isDevelopmentMode() || application.warDeployed
        }

        // Register Link Generator
        String serverURL = application.config?.grails?.serverURL ?: null
        def cacheUrls = application.config?.grails.web?.linkGenerator?.useCache
        if(!(cacheUrls instanceof Boolean)) {
            cacheUrls = true
        }


        grailsLinkGenerator(cacheUrls ? CachingLinkGenerator : LinkGenerator, serverURL) { bean ->
            bean.autowire = true
        }

        assetResourceLocator(AssetResourceLocator) { bean ->
            bean.parent = "abstractGrailsResourceLocator"
        }

    }

    def getWebXmlFilterOrder() {
        ["AssetPipelineFilter": FilterManager.GRAILS_WEB_REQUEST_POSITION - 120]
    }

    def doWithWebDescriptor = { xml ->
        def mapping = application.config?.grails?.assets?.mapping ?: "assets"
        def filters = xml.filter[0]
        filters + {
            'filter' {
                'filter-name'('AssetPipelineFilter')
                'filter-class'('asset.pipeline.AssetPipelineFilter')
            }
        }

        def mappings = xml.'filter-mapping'[0]
        mappings + {
            'filter-mapping' {
                'filter-name'('AssetPipelineFilter')
                'url-pattern'("/${mapping}/*")
                dispatcher('REQUEST')
            }
        }
    }

}
