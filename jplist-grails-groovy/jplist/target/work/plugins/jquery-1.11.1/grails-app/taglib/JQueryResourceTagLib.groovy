/*
 * Copyright 2007-2009 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import grails.util.Environment

import org.codehaus.groovy.grails.web.taglib.exceptions.GrailsTagException

class JQueryResourceTagLib {

    static namespace = "jq"

    JQueryService jQueryService

    def pluginManager

    /**
     * Alternative to using g:javascript library tag.
     * Will just pull in the resources, from the plugin instead of from the app.
     * As of 1.4.2.2 you must run install-jquery script to install the files into your app
     * instead of using the plugin versions. You may need to do this for Grails ajax tag integration,
     * but for normal jQuery usage you should use this jq:resources tag.
     */
    def resources = { attrs ->
        def plugin = pluginManager.getGrailsPlugin('jquery')
        def jqver = plugin.instance.getClass().jQueryVersion

        def flavour = Environment.isDevelopmentMode() ? '' : '.min'
        def fn = "jquery-${jqver}${flavour}.js"
        // Let user specify local="true" to stop us loading from the plugin, instead from the app
        def local = attrs.remove('local')?.toString()
        def pluginName = local?.toBoolean() ? null : 'jquery'
        out << """<script src="${g.resource(plugin:pluginName, dir:'js/jquery', file:fn).encodeAsHTML()}" type="text/javascript"></script>"""
    }

    /**
     * Include JavaScript and CSS resources in the head.
     * -- attrs.components = comma separated list of ui components to include
     * -- attrs.effects = comma separated list of effects to include
     * -- attrs.theme = css theme to use, defaults to 'base'
     * -- attrs.mode = javascript packing to use. Can be 'min' (default),
     *    'packed' or 'normal'
     */
    def resource = { attrs ->
        def components = attrs.remove('components')
        if (components instanceof String) {
            components = components.split(/[,;]/).collect {it.trim()}
        }
        if (!components) throw new GrailsTagException("The resources tag must have a 'components' attribute")

        def jsFolder    = jQueryService.jsFolder
        def coreSuffix  = jQueryService.coreSuffix

        def cssFolder   = jQueryService.cssFolder
        def cssDefault  = jQueryService.cssDefault
        def minFolder   = jQueryService.minFolder
        def minExt      = jQueryService.minExt

        // initialise the 2 closure we'll need
        def exist       = jQueryService.exist
        def cleanPath   = jQueryService.cleanPath

        def mode = Environment.isDevelopmentMode() ? 'normal' : 'min'
        def bundle = attrs.remove('bundle') ?: ''
        def theme = cleanPath(attrs.remove('theme') ?: cssDefault)

        def js = []
        def css = []
        def subdir = ''
        switch (mode) {
            case 'min':
                subdir = minFolder
                mode = '.' + minExt
                break
            case 'packed':
                subdir = 'packed/'
                mode = '.packed'
                break
            case 'normal':
                mode = ''
                break
        }

        if (bundle) bundle += '.'

        components.each { component ->
            addResource "${subdir}${bundle}${component}${mode}.js", js
            addResource "${theme}${bundle}${component}.css", css
        }

        if (js) addResource "${subdir}${bundle}${coreSuffix}${mode}.js", js
        if (css) {
            addResource "${theme}${bundle}${coreSuffix}.css", css
            addResource "${theme}${bundle}theme.css", css
        }

        js.findAll(exist.curry(jsFolder)).each {file ->
            def src = resource(jsFolder, file:file)
            //def src = createLinkTo(dir: "${pluginContextPath}/js/jquery", file: file)
            out << """<script src="${src}"></script>\n"""
        }

        css.findAll(exist.curry(cssFolder)).each {file ->
            def href = resource(dir:cssFolder, file:file)
            //def href = createLinkTo(dir: "${pluginContextPath}/themes", file: file)
            out << """<link rel="stylesheet" href="${href}" type="text/css" media="screen" />\n"""
        }
    }

    def addResource = {resource, list ->
        if (!list.contains(resource)) {
            //println "add ${resource}"
            list << resource
        }
    }
}
