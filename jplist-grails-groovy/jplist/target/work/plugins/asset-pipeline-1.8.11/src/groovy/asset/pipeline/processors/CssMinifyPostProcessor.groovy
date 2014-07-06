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
import java.util.regex.Pattern
class CssMinifyPostProcessor {
    static contentTypes = ['text/css']
    
    CssMinifyPostProcessor() {

    }

    def process(inputText, options = [:]) {
    	def removeComments = options.containsKey('removeComments') ? options.removeComments : true
    	def stripWhitespace = options.containsKey('stripWhitespace') ? options.stripWhitespace : true



        def processedCss = inputText
        if(removeComments) {
            Pattern p = Pattern.compile("/\\*+(.*?)\\*+/", Pattern.DOTALL);
        	processedCss = processedCss.replaceAll(p,"")	
        }
        if(stripWhitespace) {
        	processedCss = processedCss.replaceAll("\r\n","\n")
        	def cssLines = processedCss.split("\n")
        	cssLines = cssLines.collect { it.trim() }
        	processedCss = cssLines.join("")
        }
        
        return processedCss

    }
}
