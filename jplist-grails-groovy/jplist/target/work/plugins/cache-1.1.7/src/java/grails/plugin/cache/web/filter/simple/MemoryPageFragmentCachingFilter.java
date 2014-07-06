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

import grails.plugin.cache.web.PageInfo;
import grails.plugin.cache.web.filter.PageFragmentCachingFilter;

import org.springframework.cache.Cache;
import org.springframework.cache.Cache.ValueWrapper;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;

/**
 * In-memory-based implementation of PageFragmentCachingFilter.
 *
 * @author Burt Beckwith
 */
public class MemoryPageFragmentCachingFilter extends PageFragmentCachingFilter {

//	@Override
//	protected void replaceCacheWithDecoratedCache(Cache cache, BlockingCache blocking) {
//		// TODO
//		getNativeCacheManager().replaceCacheWithDecoratedCache(
//				(Ehcache)cache.getNativeCache(), (Ehcache)blocking.getNativeCache());
//	}

//	@SuppressWarnings({ "cast", "unchecked" })
//	@Override
//	protected BlockingCache createBlockingCache(Cache c) {
//		ConcurrentMapCache cache = (ConcurrentMapCache)c;
//		return new MemoryBlockingCache(cache.getName(),
//				(ConcurrentMap<Object, Object>)cache.getNativeCache(), cache.isAllowNullValues());
//	}

	@Override
	protected int getTimeToLive(ValueWrapper wrapper) {
		// not applicable
		return Integer.MAX_VALUE;
	}

	@Override
	protected ConcurrentMapCacheManager getNativeCacheManager() {
		return (ConcurrentMapCacheManager)super.getNativeCacheManager();
	}

	@Override
	protected void put(Cache cache, String key, PageInfo pageInfo, Integer timeToLiveSeconds) {
		// TTL isn't supported in the in-memory implementation
		cache.put(key, pageInfo);
	}
}
