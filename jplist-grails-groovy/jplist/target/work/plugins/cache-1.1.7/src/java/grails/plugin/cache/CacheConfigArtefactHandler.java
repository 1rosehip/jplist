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
package grails.plugin.cache;

import groovy.lang.GroovySystem;
import groovy.lang.MetaClass;

import org.codehaus.groovy.grails.commons.AbstractInjectableGrailsClass;
import org.codehaus.groovy.grails.commons.ArtefactHandlerAdapter;
import org.codehaus.groovy.grails.commons.InjectableGrailsClass;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.context.ConfigurableApplicationContext;

/**
 * Artefact handler for CacheConfig classes.
 *
 * @author Burt Beckwith
 */
public class CacheConfigArtefactHandler extends ArtefactHandlerAdapter {

	/** The artefact type. */
	public static final String TYPE = "CacheConfig";

	/**
	 * Default constructor.
	 */
	public CacheConfigArtefactHandler() {
		super(TYPE, CacheConfigGrailsClass.class, DefaultCacheConfigGrailsClass.class, TYPE);
	}

	/**
	 * GrailsClass interface for CacheConfig definitions.
	 */
	public static interface CacheConfigGrailsClass extends InjectableGrailsClass {
		// no methods
	}

	/**
	 * Default implementation of <code>CacheConfigGrailsClass</code>.
	 */
	public static class DefaultCacheConfigGrailsClass extends AbstractInjectableGrailsClass
	       implements CacheConfigGrailsClass {

		/**
		 * Default constructor.
		 * @param wrappedClass
		 */
		public DefaultCacheConfigGrailsClass(Class<?> wrappedClass) {
			super(wrappedClass, CacheConfigArtefactHandler.TYPE);
		}

		@Override
		public MetaClass getMetaClass() {
			// Workaround for http://jira.codehaus.org/browse/GRAILS-4542
			return GroovySystem.getMetaClassRegistry().getMetaClass(DefaultCacheConfigGrailsClass.class);
		}

		@Override
		public Object newInstance() {
			Object instance = super.newInstance();
			autowireBeanProperties(instance);
			return instance;
		}

		protected void autowireBeanProperties(Object instance) {
			ConfigurableApplicationContext ctx = (ConfigurableApplicationContext)grailsApplication.getMainContext();
			ctx.getBeanFactory().autowireBeanProperties(instance,
					AutowireCapableBeanFactory.AUTOWIRE_BY_NAME, false);
		}
	}
}
