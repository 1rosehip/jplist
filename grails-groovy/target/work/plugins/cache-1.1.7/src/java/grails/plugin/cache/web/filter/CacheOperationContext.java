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
package grails.plugin.cache.web.filter;

import java.lang.reflect.Method;
import java.util.Collection;

import javax.servlet.http.HttpServletRequest;

import org.springframework.cache.Cache;
import org.springframework.cache.interceptor.CacheOperation;
import org.springframework.expression.EvaluationContext;
import org.springframework.util.StringUtils;

/**
 * Based on org.springframework.cache.interceptor.CacheAspectSupport.CacheOperationContext
 *
 * @author Costin Leau
 * @author Juergen Hoeller
 * @author Chris Beams
 * @author Burt Beckwith
 */
public class CacheOperationContext {

	protected final Collection<Cache> caches;
	protected final ExpressionEvaluator evaluator;
	protected final WebKeyGenerator keyGenerator;
	protected final CacheOperation operation;
	protected final Method method;

	// context passed around to avoid multiple creations
	protected final EvaluationContext evalContext;
	protected final HttpServletRequest request;

	public CacheOperationContext(CacheOperation operation, Method method, Object[] args,
			Class<?> targetClass, Collection<Cache> caches, ExpressionEvaluator evaluator,
			WebKeyGenerator keyGenerator, HttpServletRequest request) {
		this.operation = operation;
		this.caches = caches;
		this.method = method;
		this.evaluator = evaluator;
		this.keyGenerator = keyGenerator;
		this.request = request;

		evalContext = evaluator.createEvaluationContext(caches, method, args, targetClass);
	}

	protected boolean isConditionPassing() {
		if (StringUtils.hasText(operation.getCondition())) {
			return evaluator.condition(operation.getCondition(), method, evalContext);
		}
		return true;
	}

	/**
	 * Computes the key for the given caching operation.
	 *
	 * @return generated key (null if none can be generated)
	 */
	protected Object generateKey() {
		if (StringUtils.hasText(operation.getKey())) {
			return evaluator.key(operation.getKey(), method, evalContext);
		}
		return keyGenerator.generate(request);
	}

	protected Collection<Cache> getCaches() {
		return caches;
	}
}
