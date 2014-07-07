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
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.cache.Cache;
import org.springframework.core.LocalVariableTableParameterNameDiscoverer;
import org.springframework.core.ParameterNameDiscoverer;
import org.springframework.expression.EvaluationContext;
import org.springframework.expression.Expression;
import org.springframework.expression.spel.standard.SpelExpressionParser;

/**
 * Based on package-scope org.springframework.cache.interceptor.ExpressionEvaluator
 *
 * @author Costin Leau
 * @author Burt Beckwith
 */
public class ExpressionEvaluator {

	protected SpelExpressionParser parser = new SpelExpressionParser();

	// shared param discoverer since it caches data internally
	protected ParameterNameDiscoverer paramNameDiscoverer = new LocalVariableTableParameterNameDiscoverer();

	protected Map<String, Expression> conditionCache = new ConcurrentHashMap<String, Expression>();
	protected Map<String, Expression> keyCache = new ConcurrentHashMap<String, Expression>();
	protected Map<String, Method> targetMethodCache = new ConcurrentHashMap<String, Method>();

	public EvaluationContext createEvaluationContext(Collection<Cache> caches, Method method,
			Object[] args, Class<?> targetClass) {
		CacheExpressionRootObject rootObject = new CacheExpressionRootObject(caches, method, targetClass);
		return new LazyParamAwareEvaluationContext(rootObject, paramNameDiscoverer, method,
				args, targetClass, targetMethodCache);
	}

	public boolean condition(String conditionExpression, Method method, EvaluationContext evalContext) {
		String key = toString(method, conditionExpression);
		Expression condExp = conditionCache.get(key);
		if (condExp == null) {
			condExp = parser.parseExpression(conditionExpression);
			conditionCache.put(key, condExp);
		}
		return condExp.getValue(evalContext, boolean.class);
	}

	public Object key(String keyExpression, Method method, EvaluationContext evalContext) {
		String key = toString(method, keyExpression);
		Expression keyExp = keyCache.get(key);
		if (keyExp == null) {
			keyExp = parser.parseExpression(keyExpression);
			keyCache.put(key, keyExp);
		}
		return keyExp.getValue(evalContext);
	}

	protected String toString(Method method, String expression) {
		return method.getDeclaringClass().getName() + '#' + method + '#' + expression;
	}
}
