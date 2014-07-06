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

import java.io.Serializable;
import java.lang.reflect.AnnotatedElement;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.codehaus.groovy.grails.commons.ControllerArtefactHandler;
import org.codehaus.groovy.grails.commons.GrailsApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheAnnotationParser;
import org.springframework.cache.annotation.SpringCacheAnnotationParser;
import org.springframework.cache.interceptor.CacheOperation;
import org.springframework.cache.interceptor.CacheOperationSource;
import org.springframework.core.BridgeMethodResolver;
import org.springframework.util.ClassUtils;
import org.springframework.util.ObjectUtils;

/**
 * getCacheOperations is called when beans are initialized and also from
 * PageFragmentCachingFilter during requests; the filter needs annotations on
 * controllers but if the standard lookup includes controllers, the return
 * values from the controller method calls are cached unnecessarily.
 *
 * Based on org.springframework.cache.annotation.AnnotationCacheOperationSource.
 *
 * @author Costin Leau
 * @author Burt Beckwith
 */
public class GrailsAnnotationCacheOperationSource implements CacheOperationSource, Serializable {

	private static final long serialVersionUID = 1;

	public static final String BEAN_NAME = "org.springframework.cache.annotation.AnnotationCacheOperationSource#0";

	/**
	 * Canonical value held in cache to indicate no caching attribute was
	 * found for this method and we don't need to look again.
	 */
	protected static final Collection<CacheOperation> NULL_CACHING_ATTRIBUTE = Collections.emptyList();

	protected GrailsApplication application;
	protected boolean publicMethodsOnly = true;
	protected Logger logger = LoggerFactory.getLogger(getClass());

	protected final Set<CacheAnnotationParser> annotationParsers =
			new LinkedHashSet<CacheAnnotationParser>(1);

	/**
	 * Cache of CacheOperations, keyed by DefaultCacheKey (Method + target Class).
	 */
	protected final Map<Object, Collection<CacheOperation>> attributeCache =
			new ConcurrentHashMap<Object, Collection<CacheOperation>>();

	/**
	 * Constructor.
	 */
	public GrailsAnnotationCacheOperationSource() {
		annotationParsers.add(new SpringCacheAnnotationParser());
	}

	public Collection<CacheOperation> getCacheOperations(Method method, Class<?> targetClass,
			boolean includeControllers) {

		if (!includeControllers && isControllerClass(targetClass)) {
			return null;
		}

		// will typically be called with includeControllers = true (i.e. from the filter)
		// so controller methods will be considered
		return doGetCacheOperations(method, targetClass);
	}

	public Collection<CacheOperation> getCacheOperations(Method method, Class<?> targetClass) {

		// exclude controllers when called directly

		if (isControllerClass(targetClass)) {
			return null;
		}

		return doGetCacheOperations(method, targetClass);
	}

	/**
	 * Determine the caching attribute for this method invocation.
	 * <p>Defaults to the class's caching attribute if no method attribute is found.
	 * @param method the method for the current invocation (never {@code null})
	 * @param targetClass the target class for this invocation (may be {@code null})
	 * @return {@link CacheOperation} for this method, or {@code null} if the method
	 * is not cacheable
	 */
	protected Collection<CacheOperation> doGetCacheOperations(Method method, Class<?> targetClass) {
		// First, see if we have a cached value.
		Object cacheKey = getCacheKey(method, targetClass);
		Collection<CacheOperation> cached = attributeCache.get(cacheKey);
		if (cached == null) {
			// We need to work it out.
			Collection<CacheOperation> cacheOps = computeCacheOperations(method, targetClass);
			// Put it in the cache.
			if (cacheOps == null) {
				attributeCache.put(cacheKey, NULL_CACHING_ATTRIBUTE);
			}
			else {
				logger.debug("Adding cacheable method '{}' with attribute: {}", method.getName(), cacheOps);
				attributeCache.put(cacheKey, cacheOps);
			}
			return cacheOps;
		}

		if (cached == NULL_CACHING_ATTRIBUTE) {
			return null;
		}

		// Value will either be canonical value indicating there is no caching attribute,
		// or an actual caching attribute.
		return cached;
	}

	/**
	 * For dev mode when rediscovering annotations is needed.
	 */
	public void reset() {
		attributeCache.clear();
	}

	/**
	 * Determine a cache key for the given method and target class.
	 * <p>Must not produce same key for overloaded methods.
	 * Must produce same key for different instances of the same method.
	 * @param method the method (never {@code null})
	 * @param targetClass the target class (may be {@code null})
	 * @return the cache key (never {@code null})
	 */
	protected Object getCacheKey(Method method, Class<?> targetClass) {
		return new DefaultCacheKey(method, targetClass);
	}

	protected Collection<CacheOperation> computeCacheOperations(Method method, Class<?> targetClass) {
		// Don't allow no-public methods as required.
		if (publicMethodsOnly && !Modifier.isPublic(method.getModifiers())) {
			return null;
		}

		// The method may be on an interface, but we need attributes from the target class.
		// If the target class is null, the method will be unchanged.
		Method specificMethod = ClassUtils.getMostSpecificMethod(method, targetClass);
		// If we are dealing with method with generic parameters, find the original method.
		specificMethod = BridgeMethodResolver.findBridgedMethod(specificMethod);

		// First try is the method in the target class.
		Collection<CacheOperation> opDef = findCacheOperations(specificMethod);
		if (opDef != null) {
			return opDef;
		}

		// Second try is the caching operation on the target class.
		opDef = findCacheOperations(specificMethod.getDeclaringClass());
		if (opDef != null) {
			return opDef;
		}

		if (specificMethod != method) {
			// Fall back is to look at the original method.
			opDef = findCacheOperations(method);
			if (opDef != null) {
				return opDef;
			}
			// Last fall back is the class of the original method.
			return findCacheOperations(method.getDeclaringClass());
		}

		return null;
	}

	protected Collection<CacheOperation> findCacheOperations(Class<?> clazz) {
		return determineCacheOperations(clazz);
	}

	protected Collection<CacheOperation> findCacheOperations(Method method) {
		return determineCacheOperations(method);
	}

	/**
	 * Determine the cache operation(s) for the given method or class.
	 * <p>This implementation delegates to configured
	 * {@link CacheAnnotationParser}s for parsing known annotations into
	 * Spring's metadata attribute class.
	 * <p>Can be overridden to support custom annotations that carry
	 * caching metadata.
	 * @param ae the annotated method or class
	 * @return the configured caching operations, or {@code null} if none found
	 */
	protected Collection<CacheOperation> determineCacheOperations(AnnotatedElement ae) {
		Collection<CacheOperation> ops = null;

		for (CacheAnnotationParser annotationParser : annotationParsers) {
			Collection<CacheOperation> annOps = annotationParser.parseCacheAnnotations(ae);
			if (annOps != null) {
				if (ops == null) {
					ops = new ArrayList<CacheOperation>();
				}
				ops.addAll(annOps);
			}
		}

		return ops;
	}

	protected boolean isControllerClass(Class<?> targetClass) {
		return application.isArtefactOfType(ControllerArtefactHandler.TYPE, targetClass);
	}

	/**
	 * Dependency injection for the grails application.
	 * @param grailsApplication the app
	 */
	public void setGrailsApplication(GrailsApplication grailsApplication) {
		application = grailsApplication;
	}

	/**
	 * Dependency injection for whether to only consider public methods
	 * @param allow
	 */
	public void setAllowPublicMethodsOnly(boolean allow) {
		publicMethodsOnly = allow;
	}

	/**
	 * Default cache key for the CacheOperation cache.
	 */
	protected static class DefaultCacheKey {

		protected final Method method;
		protected final Class<?> targetClass;

		public DefaultCacheKey(Method method, Class<?> targetClass) {
			this.method = method;
			this.targetClass = targetClass;
		}

		@Override
		public boolean equals(Object other) {
			if (this == other) {
				return true;
			}
			if (!(other instanceof DefaultCacheKey)) {
				return false;
			}
			DefaultCacheKey otherKey = (DefaultCacheKey) other;
			return method.equals(otherKey.method) &&
					ObjectUtils.nullSafeEquals(targetClass, otherKey.targetClass);
		}

		@Override
		public int hashCode() {
			return method.hashCode() * 29 + (targetClass == null ? 0 : targetClass.hashCode());
		}
	}
}
