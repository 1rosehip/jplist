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

import org.springframework.context.ApplicationContext
import org.springframework.context.ApplicationContextAware

 /**
 * @author Sergey Nebolsin (nebolsin@prophotos.ru)
 * @author Finn Herpich (finn.herpich <at> marfinn-software <dot> de)
 */
class JQueryTagLib implements ApplicationContextAware {

    static namespace = "jq"

    def jQueryConfig

    def pluginManager

    /**
     * Includes a plugin javascript file
     *
     * @param attrs A plugin to use
     */
    def plugin = { attrs, body ->
        if (!attrs.name) {
            return
        }

        def plugin = pluginManager.getGrailsPlugin('jquery')

        // TODO kick this damn need for the config-file
        jQueryConfig.plugins."${attrs.name}".each {
            out << '<script type="text/javascript" src="'
            out << g.resource(dir: "js/" + plugin.instance.getClass().jQuerySources, file: it)
            out << '"></script>'
        }
    }

    /**
     * Adds the jQuery().ready function to the code
     *
     * @param attrs No use
     * @param body  The javascript code to execute
     */
    def jquery = { attrs, body ->
        out << '<script type="text/javascript">jQuery(function(){'
        out << body()
        out << '}); </script>'
    }

    /**
     * Simple tag to make an element toggleable
     *
     * @param attrs List with the arguments
     *              sourceId -> link-element which fires the toggle action
     *              targetId -> id of the element to toggle
     *              event    -> event to fire the toggle action on (OPTIONAL)
     *              speed    -> effect-speed (OPTIONAL)
     */
    def toggle = { attrs ->
        // Default values
        if (!attrs.event) attrs.event = 'click'
        if (!attrs.speed) attrs.speed = 'normal'

        // out
        out << /jQuery("#${attrs['sourceId']}").${attrs['event']}(function(){jQuery("#${attrs['targetId']}").toggle("${attrs['speed']}"); return false; });/
    }

    /**
     * Creates a jQuery-function which returns the value of the specified element
     *
     * @param attrs Must contain either an attribute selector or elementId that specifies the target element
     */
    def fieldValue = { attrs ->
        def selector

        if (attrs.selector) {
            selector = attrs['selector']
        } else if (attrs.elementId) {
            selector = /#${attrs['elementId']}/
        }

        out << /jQuery('${selector}').fieldValue()[0]/
    }

    void setApplicationContext(ApplicationContext applicationContext) {
        jQueryConfig = applicationContext.jQueryConfig
    }

    def toggleelement = { attrs ->
        log.info('toggleelement is deprecated, please use toggle instead')
        out << /jQuery("#${attrs['linkId']}").${attrs['event']}(function(){ jQuery("#${attrs['elementId']}").toggle("${attrs['speed']}"); return false; });/
    }
}
