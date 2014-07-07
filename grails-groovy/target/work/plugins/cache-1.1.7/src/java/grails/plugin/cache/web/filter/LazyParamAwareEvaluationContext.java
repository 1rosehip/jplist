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
import java.util.Map;

import org.springframework.aop.support.AopUtils;
import org.springframework.core.ParameterNameDiscoverer;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.util.ObjectUtils;

/**
 * Evaluation context class that adds a method parameters as SpEL
 * variables, in a lazy manner. The lazy nature eliminates unneeded
 * parsing of classes byte code for parameter discovery.
 *
 * <p>To limit the creation of objects, an ugly constructor is used
 * (rather then a dedicated 'closure'-like class for deferred execution).
 *
 * Based on package-scope org.springframework.cache.interceptor
 * @author Costin Leau
 * @author Burt Beckwith
 */
public class LazyParamAwareEvaluationContext extends StandardEvaluationContext {

	protected final ParameterNameDiscoverer paramDiscoverer;
	protected final Method method;
	protected final Object[] args;
	protected final Class<?> targetClass;
	protected final Map<String, Method> methodCache;
	protected boolean paramLoaded = false;

	public LazyParamAwareEvaluationContext(Object rootObject, ParameterNameDiscoverer paramDiscoverer, Method method,
			Object[] args, Class<?> targetClass, Map<String, Method> methodCache) {
		super(rootObject);

		this.paramDiscoverer = paramDiscoverer;
		this.method = method;
		this.args = args;
		this.targetClass = targetClass;
		this.methodCache = methodCache;
	}

	/**
	 * Load the param information only when needed.
	 */
	@Override
	public Object lookupVariable(String name) {
		Object variable = super.lookupVariable(name);
		if (variable != null) {
			return variable;
		}

		if (!paramLoaded) {
			loadArgsAsVariables();
			paramLoaded = true;
			variable = super.lookupVariable(name);
		}

		return variable;
	}

	protected void loadArgsAsVariables() {
		// shortcut if no args need to be loaded
		if (ObjectUtils.isEmpty(args)) {
			return;
		}

		String key = toString(method);
		Method targetMethod = methodCache.get(key);
		if (targetMethod == null) {
			targetMethod = AopUtils.getMostSpecificMethod(method, targetClass);
			if (targetMethod == null) {
				targetMethod = method;
			}
			methodCache.put(key, targetMethod);
		}

		// save arguments as indexed variables
		for (int i = 0; i < args.length; i++) {
			setVariable("p" + i, args[i]);
		}

		String[] parameterNames = paramDiscoverer.getParameterNames(targetMethod);
		// save parameter names (if discovered)
		if (parameterNames != null) {
			for (int i = 0; i < parameterNames.length; i++) {
				setVariable(parameterNames[i], args[i]);
			}
		}
	}

	protected String toString(Method m) {
		return m.getDeclaringClass().getName() + '#' + m;
	}
}
