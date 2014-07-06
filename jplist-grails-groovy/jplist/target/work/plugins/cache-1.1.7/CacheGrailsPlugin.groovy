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
import grails.plugin.cache.CacheBeanPostProcessor
import grails.plugin.cache.CacheConfigArtefactHandler
import grails.plugin.cache.ConfigLoader
import grails.plugin.cache.CustomCacheKeyGenerator
import grails.plugin.cache.GrailsConcurrentMapCacheManager
import grails.plugin.cache.web.filter.DefaultWebKeyGenerator
import grails.plugin.cache.web.filter.ExpressionEvaluator
import grails.plugin.cache.web.filter.NoOpFilter
import grails.plugin.cache.web.filter.simple.MemoryPageFragmentCachingFilter

import org.codehaus.groovy.grails.commons.GrailsApplication
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.cache.Cache
import org.springframework.core.Ordered
import org.springframework.web.filter.DelegatingFilterProxy
import javassist.util.proxy.*;

class CacheGrailsPlugin {

	static {
		ProxyFactory.classLoaderProvider = new ProxyFactory.ClassLoaderProvider() {
			public ClassLoader get(ProxyFactory pf) {
					return Thread.currentThread().getContextClassLoader();
			}
		};
	}

	private final Logger log = LoggerFactory.getLogger('grails.plugin.cache.CacheGrailsPlugin')

	def version = '1.1.7'
	def grailsVersion = '2.0 > *'
	def observe = ['controllers', 'services']
	def loadAfter = ['controllers', 'services']
	def artefacts = [CacheConfigArtefactHandler]
	def watchedResources = [
		'file:./grails-app/conf/**/*CacheConfig.groovy',
		'file:./plugins/*/grails-app/conf/**/*CacheConfig.groovy'
	]

	def title = 'Cache Plugin'
	def author = 'Jeff Brown'
	def authorEmail = 'jbrown@vmware.com'
	def description = 'Grails Cache Plugin'
	def documentation = 'http://grails-plugins.github.com/grails-cache/'

	def license = 'APACHE'
	def organization = [name: 'SpringSource', url: 'http://www.springsource.org/']
	def developers = [[name: 'Burt Beckwith', email: 'beckwithb@vmware.com']]
	def issueManagement = [system: 'JIRA', url: 'http://jira.grails.org/browse/GPCACHE']
	def scm = [url: 'https://github.com/grails-plugins/grails-cache']

	def pluginExcludes = [
		'**/com/demo/**',
		'grails-app/conf/TestCacheConfig.groovy',
		'grails-app/views/**',
		'grails-app/i18n/**',
		'web-app/**',
		'docs/**',
		'src/docs/**'
	]

	def getWebXmlFilterOrder() {
		def FilterManager = getClass().getClassLoader().loadClass('grails.plugin.webxml.FilterManager')
		[grailsCacheFilter: FilterManager.URL_MAPPING_POSITION + 1000]
	}

	def doWithWebDescriptor = {xml ->
		if (!isEnabled(application)) {
			return
		}

		def filters = xml.filter
		def lastFilter = filters[filters.size() - 1]
		lastFilter + {
			filter {
				'filter-name'('grailsCacheFilter')
				'filter-class'(DelegatingFilterProxy.name)
				'init-param' {
					'param-name'('targetFilterLifecycle')
					'param-value'('true')
				}
			}
		}

		def filterMappings = xml.'filter-mapping'
		def lastMapping = filterMappings[filterMappings.size() - 1]
		lastMapping + {
			'filter-mapping' {
				'filter-name'('grailsCacheFilter')
				'url-pattern'('*.dispatch')
				'dispatcher'('FORWARD')
				'dispatcher'('INCLUDE')
			}
		}
	}

	def doWithSpring = {
		if (!isEnabled(application)) {
			log.warn 'Cache plugin is disabled'
			grailsCacheFilter(NoOpFilter)
			return
		}

		def cacheConfig = application.config.grails.cache
		def proxyTargetClass = cacheConfig.proxyTargetClass
		if (!(proxyTargetClass instanceof Boolean)) proxyTargetClass = false
		def order = cacheConfig.aopOrder
		if (!(order instanceof Number)) order = Ordered.LOWEST_PRECEDENCE
		// allow user can to use their own key generator.
		def cacheKeyGen = cacheConfig.keyGenerator ?: 'customCacheKeyGenerator'
		customCacheKeyGenerator(CustomCacheKeyGenerator)

		xmlns cache: 'http://www.springframework.org/schema/cache'

		// creates 3 beans: org.springframework.cache.config.internalCacheAdvisor (org.springframework.cache.interceptor.BeanFactoryCacheOperationSourceAdvisor),
		//                  org.springframework.cache.annotation.AnnotationCacheOperationSource#0 (org.springframework.cache.annotation.AnnotationCacheOperationSource),
		//                  org.springframework.cache.interceptor.CacheInterceptor#0 (org.springframework.cache.interceptor.CacheInterceptor)

		cache.'annotation-driven'('cache-manager': 'grailsCacheManager' ,'key-generator': cacheKeyGen,
		                          mode: 'proxy', order: order, 'proxy-target-class': proxyTargetClass)

		// updates the AnnotationCacheOperationSource with a custom subclass
		// and adds the 'cacheOperationSource' alias
		cacheBeanPostProcessor(CacheBeanPostProcessor)

		grailsCacheManager(GrailsConcurrentMapCacheManager)

		grailsCacheConfigLoader(ConfigLoader)

		webCacheKeyGenerator(DefaultWebKeyGenerator)

		webExpressionEvaluator(ExpressionEvaluator)

		grailsCacheFilter(MemoryPageFragmentCachingFilter) {
			cacheManager =         ref('grailsCacheManager')
			cacheOperationSource = ref('cacheOperationSource')
			keyGenerator =         ref('webCacheKeyGenerator')
			expressionEvaluator =  ref('webExpressionEvaluator')
		}
	}

	def doWithApplicationContext = { ctx ->
		reloadCaches ctx

		def cacheConfig = ctx.grailsApplication.config.grails.cache
		if (cacheConfig.clearAtStartup instanceof Boolean && cacheConfig.clearAtStartup) {
			def grailsCacheManager = ctx.grailsCacheManager
			for (String cacheName in grailsCacheManager.cacheNames) {
				log.info "Clearing cache $cacheName"
				Cache cache = grailsCacheManager.getCache(cacheName)
				cache.clear()
			}
		}
	}

	def onChange = { event ->

		def application = event.application
		if (!isEnabled(application)) {
			return
		}

		def source = event.source
		if (!source) {
			return
		}

		if (application.isControllerClass(source) || application.isServiceClass(source)) {
			event.ctx.cacheOperationSource.reset()
			log.debug 'Reset GrailsAnnotationCacheOperationSource cache'
		}
		else if (application.isCacheConfigClass(source)) {
			reloadCaches event.ctx
		}
	}

	def onConfigChange = { event ->
		reloadCaches event.ctx
	}

	private void reloadCaches(ctx) {

		if (!isEnabled(ctx.grailsApplication)) {
			return
		}

		ctx.grailsCacheConfigLoader.reload ctx
		log.debug 'Reloaded grailsCacheConfigLoader'
	}

	private boolean isEnabled(GrailsApplication application) {
		def enabled = application.config.grails.cache.enabled
		enabled == null || enabled != false
	}
}
