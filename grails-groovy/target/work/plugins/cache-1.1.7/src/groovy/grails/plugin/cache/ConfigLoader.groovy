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

import org.codehaus.groovy.grails.commons.GrailsApplication
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.context.ApplicationContext

import grails.plugin.cache.CacheConfigArtefactHandler.CacheConfigGrailsClass
import grails.util.Environment

/**
 * @author Burt Beckwith
 */
class ConfigLoader {

	static final int DEFAULT_ORDER = 1000

	protected Logger log = LoggerFactory.getLogger(getClass())

	/**
	 * Reload the cache configuration from Config.groovy and *CacheConfig.groovy files.
	 *
	 * @param ctx the application context
	 */
	void reload(ApplicationContext ctx) {
		def application = ctx.grailsApplication
		List<ConfigObject> configs = loadOrderedConfigs(application)
		reload configs, ctx
	}

	/**
	 * Reload the cache configuration from the specified config objects.
	 *
	 * @param configs ordered ConfigObjects, typically from loadOrderedConfigs(); must contain
	 * a 'config' closure defining cache(s).
	 * @param ctx the application context
	 */
	void reload(List<ConfigObject> configs, ApplicationContext ctx) {

		def configuredCacheNames = [] as LinkedHashSet
		for (ConfigObject co : configs) {
			ConfigBuilder builder = new ConfigBuilder()
			if (co.config instanceof Closure) {
				builder.parse co.config
			}
			configuredCacheNames.addAll builder.cacheNames
		}

		GrailsCacheManager cacheManager = ctx.grailsCacheManager

		for (String name in cacheManager.cacheNames) {
			if (!configuredCacheNames.contains(name)) {
				cacheManager.destroyCache name
			}
		}

		for (String cacheName in configuredCacheNames) {
			cacheManager.getCache cacheName
		}
	}

	/**
	 * Retrieve ConfigObject instances from Config.groovy and *CacheConfig.groovy files.
	 * @param application the application
	 * @return the configs, ordered by their 'order' value (or the default value of 1000 if not specified)
	 */
	List<ConfigObject> loadOrderedConfigs(GrailsApplication application) {
		ConfigSlurper slurper = new ConfigSlurper(Environment.current.name)

		List<ConfigObject> configs = []
		def cacheConfig
		for (configClass in application.cacheConfigClasses) {
			def config = slurper.parse(configClass.clazz)
			cacheConfig = config.config
			if ((cacheConfig instanceof Closure) && processConfig(config, configClass)) {
				configs << config
				log.debug "Including configs from $configClass.name with order $cacheConfig.order"
			}
			else {
				log.debug "Not including configs from $configClass.name"
			}
		}

		cacheConfig = application.config.grails.cache

		if ((cacheConfig.config instanceof Closure) && processConfig(cacheConfig, null)) {
			configs << cacheConfig
			log.debug "Including configs from Config.groovy with order $cacheConfig.order"
		}
		else {
			log.debug "Not including configs from Config.groovy"
		}

		sortConfigs configs

		configs
	}

	protected boolean processConfig(ConfigObject config, CacheConfigGrailsClass configClass) {
		if (config.config instanceof Closure) {
			def order = config.order
			if (!(order instanceof Number)) {
				config.order = DEFAULT_ORDER
			}
			config._sourceClassName = configClass == null ? 'Config' : configClass.clazz.name
			return true
		}

		false
	}

	protected void sortConfigs(List<Closure> configs) {
		configs.sort { c1, c2 ->
			c1.order == c2.order ? c1._sourceClassName <=> c2._sourceClassName : c1.order <=> c2.order
		}
	}
}
