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
package grails.plugin.cache

import grails.plugin.cache.CacheEvict

class GrailsCacheAdminService {

    static transactional = false

    def grailsCacheManager

    @CacheEvict(value="grailsBlocksCache", allEntries=true)
    def clearBlocksCache() {}

    @CacheEvict(value="grailsTemplatesCache", allEntries=true)
    def clearTemplatesCache() {}

    def clearCache(cacheName) {
        grailsCacheManager.getCache(cacheName)?.clear()
    }

    def clearAllCaches() {
        grailsCacheManager.cacheNames.each { cacheName ->
            clearCache(cacheName)
        }
    }

}
