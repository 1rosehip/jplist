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

import org.springframework.cache.Cache;
import org.springframework.util.Assert;

/**
 * Based on package-scope org.springframework.cache.interceptor.
 *
 * @author Costin Leau
 * @author Burt Beckwith
 */
public class CacheExpressionRootObject {

	protected final Collection<Cache> caches;
	protected final Method method;
	protected final Class<?> targetClass;

	public CacheExpressionRootObject(Collection<Cache> caches, Method method, Class<?> targetClass) {

		Assert.notNull(method, "Method is required");
		Assert.notNull(targetClass, "targetClass is required");
		this.method = method;
		this.targetClass = targetClass;
		this.caches = caches;
	}

	public Collection<Cache> getCaches() {
		return caches;
	}

	public Method getMethod() {
		return method;
	}

	public String getMethodName() {
		return method.getName();
	}

	public Class<?> getTargetClass() {
		return targetClass;
	}
}
