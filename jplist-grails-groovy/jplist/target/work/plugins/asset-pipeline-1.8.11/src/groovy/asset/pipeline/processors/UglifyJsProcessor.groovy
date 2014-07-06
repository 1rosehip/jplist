/*
 * Copyright 2014 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package asset.pipeline.processors

import org.mozilla.javascript.Context
import org.mozilla.javascript.Function
import org.mozilla.javascript.Scriptable
import org.mozilla.javascript.tools.shell.Global
import org.mozilla.javascript.NativeObject

class UglifyJsProcessor {
    static contentTypes = ['application/javascript']
    private Scriptable scope
    private Function uglify

    UglifyJsProcessor() {
        ClassLoader classLoader = getClass().classLoader
        URL parserLib = classLoader.getResource('uglifyjs/lib/parse-js.js')
        URL processLib = classLoader.getResource('uglifyjs/lib/process.js')
        URL consolidatorLib = classLoader.getResource('uglifyjs/lib/consolidator.js')
        URL squeezeLib = classLoader.getResource('uglifyjs/lib/squeeze-more.js')
        URL uglifyJs = classLoader.getResource('uglifyjs/uglify-js.js')
        Context cx = Context.enter()
        cx.optimizationLevel = 9
        Global global = new Global()
        global.init cx
        scope = cx.initStandardObjects(global)
        cx.evaluateString scope, uglifyJs.text, uglifyJs.file, 1, null
        cx.evaluateString scope, parserLib.text, parserLib.file, 1, null
        cx.evaluateString scope, processLib.text, processLib.file, 1, null
        cx.evaluateString scope, consolidatorLib.text, consolidatorLib.file, 1, null
        cx.evaluateString scope, squeezeLib.text, squeezeLib.file, 1, null
        uglify = scope.get("uglify", scope)
        Context.exit()
    }



    def process(inputText, options = [:]) {
        call uglify, inputText, parseOptions(options)
    }

    private NativeObject parseOptions(options) {

        def jsOptions = new NativeObject()

        options.each{ it ->
            if(it.key == 'strictSemicolons') {
                // jsOptions.put('strict_semicolons', scope, it.value)
                jsOptions.defineProperty("strict_semicolons",it.value, NativeObject.READONLY)
            } else if(it.key == 'mangleOptions' || it.key == 'genOptions') {
                def nestedMap = new NativeObject()
                def key = (it.key == 'mangleOptions' ? 'mangle_options' : 'gen_options')
                it.value.each { nested ->
                    nestedMap.defineProperty(nested.key, nested.value, NativeObject.READONLY)
                    // nestedMap.put(nested.key, scope,nested.value)
                }
                jsOptions.defineProperty(key,nestedMap, NativeObject.READONLY)
            }
        }
        return jsOptions
    }

    private synchronized String call(Function fn, Object[] args) {
        Context.call(null, fn, scope, scope, args)
    }
}
