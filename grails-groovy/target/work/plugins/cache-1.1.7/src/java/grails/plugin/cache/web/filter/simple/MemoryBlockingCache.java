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
package grails.plugin.cache.web.filter.simple;

import grails.plugin.cache.BlockingCache;
import grails.plugin.cache.CacheConfiguration;

import java.util.Collection;
import java.util.concurrent.ConcurrentMap;

import org.springframework.cache.concurrent.ConcurrentMapCache;

/**
 * In-memory-based implementation of BlockingCache.
 *
 * @author Burt Beckwith
 */
public class MemoryBlockingCache extends ConcurrentMapCache implements BlockingCache {

	protected final CacheConfiguration cacheConfiguration = new MemoryCacheConfiguration();

	public MemoryBlockingCache(String name, ConcurrentMap<Object, Object> store, boolean allowNullValues) {
		super(name, store, allowNullValues);
	}

	public CacheConfiguration getCacheConfiguration() {
		return cacheConfiguration;
	}

	public boolean isDisabled() {
		// TODO Auto-generated method stub
		return false;
	}

	public void setTimeoutMillis(int blockingTimeoutMillis) {
		// TODO Auto-generated method stub
	}

	public Collection<Object> getAllKeys() {
		// TODO Auto-generated method stub
		return null;
	}
}
