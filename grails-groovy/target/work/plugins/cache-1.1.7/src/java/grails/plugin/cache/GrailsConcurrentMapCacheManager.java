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

import java.util.Collection;
import java.util.Collections;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.springframework.cache.Cache;

/**
 * Based on org.springframework.cache.concurrent.ConcurrentMapCacheManager.
 *
 * @author Juergen Hoeller
 * @author Burt Beckwith
 */
public class GrailsConcurrentMapCacheManager implements GrailsCacheManager {

	protected final ConcurrentMap<String, Cache> cacheMap = new ConcurrentHashMap<String, Cache>();

	public Collection<String> getCacheNames() {
		return Collections.unmodifiableSet(cacheMap.keySet());
	}

	public Cache getCache(String name) {
		Cache cache = cacheMap.get(name);
		if (cache == null) {
			cache = createConcurrentMapCache(name);
			Cache existing = cacheMap.putIfAbsent(name, cache);
			if (existing != null) {
				cache = existing;
			}
		}
		return cache;
	}

	public boolean cacheExists(String name) {
		return getCacheNames().contains(name);
	}

	public boolean destroyCache(String name) {
		return cacheMap.remove(name) != null;
	}

	protected GrailsConcurrentMapCache createConcurrentMapCache(String name) {
		return new GrailsConcurrentMapCache(name);
	}
}
