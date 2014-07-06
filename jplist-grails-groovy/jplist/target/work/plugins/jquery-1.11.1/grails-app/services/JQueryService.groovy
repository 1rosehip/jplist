/*
 * Copyright 2007-2009 the original author or authors.
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

import grails.util.Environment

import org.springframework.beans.factory.InitializingBean

class JQueryService implements InitializingBean {

    static transactional = false

    String jsFolder
    String cssFolder
    String cssDefault
    String coreSuffix
    String minFolder
    String minExt

    def grailsApplication

    def pathChecked = []
    def pathWhichDoNotExist = []

    void afterPropertiesSet() {
        ConfigObject config = new ConfigSlurper(Environment.current.name).parse(grailsApplication.classLoader.loadClass('JQueryConfig'))

        jsFolder    = config?.jquery?.sources ?: 'js/jquery'
        coreSuffix  = config?.jquery?.coreSuffix?: 'core'

        cssFolder   = config?.jquery?.cssFolder ?: 'theme'
        cssDefault  = config?.jquery?.cssDefault ?: 'base'
        minFolder   = config?.jquery?.minFolder ?: 'minified'
        minExt      = config?.jquery?.minExtentsion ?: 'min'

        // to be sure we're talking about the same thing'
        if (!jsFolder.startsWith('js')) {
            jsFolder = 'js/' + jsFolder
        }

        // clean or prepare the folder path
        jsFolder    = cleanPath(jsFolder)
        cssFolder   = cleanPath(cssFolder)
        minFolder   = cleanPath(minFolder)
    }

    // all this is to avoid checking the filesystem too often
    def exist = { String dirPath, String filePath ->
        existPath(dirPath) && existPath(dirPath + '/' + filePath)
    }

    def existPath = { String path ->
        if (!pathChecked.contains(path)) {
            checkPath path
        }

        !pathWhichDoNotExist.contains(path)
    }

    def checkPath = {path ->
        if (!grailsApplication.mainContext.getResource(path).exists()) {
            pathWhichDoNotExist << path
        }
        pathChecked << path
    }

    def cleanPath = { path ->
        if (path && !path?.endsWith('/')) {
            path += '/'
        }
        path
    }
}
