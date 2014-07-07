/* Copyright 2012-2013 SpringSource.
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
package grails.plugin.cache

import grails.plugin.cache.util.ClassUtils

import org.codehaus.groovy.grails.web.pages.GroovyPageTemplate
import org.codehaus.groovy.grails.web.servlet.mvc.GrailsWebRequest
import org.codehaus.groovy.grails.web.util.StreamCharBuffer
import org.springframework.web.context.request.RequestContextHolder

class CacheTagLib {

	static namespace = 'cache'

	def grailsCacheManager
	def groovyPagesTemplateRenderer

	/**
	 * Renders a block of markup and caches the result so the next time the same block
	 * is rendered, it does not need to be evaluated again.
	 *
	 * @attr key An optional cache key allowing the same block to be cached with different content
	 * @attr cache Cache name ("grailsBlocksCache" is used if not specified)
	 */
	def block = { attrs, body ->
		if (!grailsCacheManager) {
			out << body()
			return
		}

		def cache = grailsCacheManager.getCache(attrs.cache ?: 'grailsBlocksCache')
		def bodyClosure = ClassUtils.getPropertyOrFieldValue(body, 'bodyClosure')
		def closureClass = bodyClosure.getClass()
		def key = closureClass.getName()
		if (attrs.key) {
			key += ':' + attrs.key
		}

		def content = cache.get(key)
		if (content == null) {
			content = cloneIfNecessary(body())
			cache.put(key, content)
		}
		else {
			content = content.get()
		}

		out << content
	}

	/**
	 * Renders a GSP template and caches the result so the next time the same template
	 * is rendered, it does not need to be evaluated again.
	 *
	 * @attr template REQUIRED The name of the template to apply
	 * @attr key An optional cache key allowing the same template to be cached with different content
	 * @attr contextPath the context path to use (relative to the application context path). Defaults to "" or path to the plugin for a plugin view or template.
	 * @attr bean The bean to apply the template against
	 * @attr model The model to apply the template against as a java.util.Map
	 * @attr collection A collection of model objects to apply the template to
	 * @attr var The variable name of the bean to be referenced in the template
	 * @attr plugin The plugin to look for the template in
	 * @attr cache Cache name ("grailsTemplatesCache" is used if not specified)
	 */
	def render = { attrs ->
		if (!grailsCacheManager) {
			out <<  g.render(attrs)
			return
		}

		def key = calculateFullKey(attrs.template, attrs.contextPath, attrs.plugin)
		if (attrs.key) {
			key += ':' + attrs.key
		}

		def cache = grailsCacheManager.getCache(attrs.cache ?: 'grailsTemplatesCache')
		def content = cache.get(key)
		if (content == null) {
			content = cloneIfNecessary(g.render(attrs))
			cache.put(key, content)
		}
		else {
			content = content.get()
		}
		out << content
	}

	protected String calculateFullKey(String templateName, String contextPath, String pluginName) {
		GrailsWebRequest webRequest = RequestContextHolder.currentRequestAttributes()
		String uri = webRequest.attributes.getTemplateUri(templateName, webRequest.request)

		GroovyPageTemplate t = groovyPagesTemplateRenderer.findAndCacheTemplate(
			webRequest, pageScope, templateName, contextPath, pluginName, uri)
		if (!t) {
			throwTagError("Template not found for name [$templateName] and path [$uri]")
		}

		t.metaInfo.pageClass.name
	}

	protected cloneIfNecessary(content) {
		if (content instanceof StreamCharBuffer) {
			if (content instanceof Cloneable) {
				content = content.clone()
			}
			else {
				// pre Grails 2.3
				content = content.toString()
			}
		}
		content
	}
}
