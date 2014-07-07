/* Copyright 2013 SpringSource.
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

import org.codehaus.groovy.grails.plugins.GrailsVersionUtils;
import org.springframework.aop.framework.AopProxyUtils;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.core.SpringVersion;

import java.io.Serializable;
import java.lang.reflect.Method;

/**
 * Includes the hashcode, method signature, and class name of the target (caller) in the cache key
 */
public class CustomCacheKeyGenerator implements KeyGenerator {
	
	private final KeyGenerator innerKeyGenerator;
	
	public CustomCacheKeyGenerator(KeyGenerator innerKeyGenerator){
		this.innerKeyGenerator = innerKeyGenerator;
	}
	
	public CustomCacheKeyGenerator(){
		// Use the Spring key generator if the Spring version is 4.0.3 or later
		// Can't use the Spring key generator if < 4.0.3 because of https://jira.spring.io/browse/SPR-11505
		if(SpringVersion.getVersion()==null || GrailsVersionUtils.isVersionGreaterThan(SpringVersion.getVersion(),"4.0.3")){
			this.innerKeyGenerator = new SimpleKeyGenerator();
		}else{
			try {
				this.innerKeyGenerator = (KeyGenerator) Class.forName("org.springframework.cache.interceptor.SimpleKeyGenerator").newInstance();
			} catch (Exception e) {
				// this should never happen
				throw new RuntimeException(e);
			}
		}
	}
	
	@SuppressWarnings("serial")
	private static final class CacheKey implements Serializable {
		final String targetClassName;
		final String targetMethodName;
		final int targetObjectHashCode;
		final Object simpleKey;
		public CacheKey(String targetClassName, String targetMethodName,
				int targetObjectHashCode, Object simpleKey) {
			this.targetClassName = targetClassName;
			this.targetMethodName = targetMethodName;
			this.targetObjectHashCode = targetObjectHashCode;
			this.simpleKey = simpleKey;
		}
		@Override
		public int hashCode() {
			final int prime = 31;
			int result = 1;
			result = prime * result
					+ ((simpleKey == null) ? 0 : simpleKey.hashCode());
			result = prime
					* result
					+ ((targetClassName == null) ? 0 : targetClassName
							.hashCode());
			result = prime
					* result
					+ ((targetMethodName == null) ? 0 : targetMethodName
							.hashCode());
			result = prime * result + targetObjectHashCode;
			return result;
		}
		@Override
		public boolean equals(Object obj) {
			if (this == obj)
				return true;
			if (obj == null)
				return false;
			if (getClass() != obj.getClass())
				return false;
			CacheKey other = (CacheKey) obj;
			if (simpleKey == null) {
				if (other.simpleKey != null)
					return false;
			} else if (!simpleKey.equals(other.simpleKey))
				return false;
			if (targetClassName == null) {
				if (other.targetClassName != null)
					return false;
			} else if (!targetClassName.equals(other.targetClassName))
				return false;
			if (targetMethodName == null) {
				if (other.targetMethodName != null)
					return false;
			} else if (!targetMethodName.equals(other.targetMethodName))
				return false;
			if (targetObjectHashCode != other.targetObjectHashCode)
				return false;
			return true;
		}
	}

	public Object generate(Object target, Method method, Object... params) {
		Class<?> objClass = AopProxyUtils.ultimateTargetClass(target);
		
		return new CacheKey(
				objClass.getName().intern(),
				method.toString().intern(),
				target.hashCode(), innerKeyGenerator.generate(target, method, params));
	}
}
