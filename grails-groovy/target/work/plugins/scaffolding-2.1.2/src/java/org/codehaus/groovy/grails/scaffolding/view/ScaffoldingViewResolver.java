/*
 * Copyright 2004-2013 SpringSource.
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
package org.codehaus.groovy.grails.scaffolding.view;

import java.io.IOException;
import java.io.Writer;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.codehaus.groovy.grails.commons.GrailsDomainClass;
import org.codehaus.groovy.grails.scaffolding.GrailsTemplateGenerator;
import org.codehaus.groovy.grails.web.pages.FastStringWriter;
import org.codehaus.groovy.grails.web.servlet.mvc.GrailsWebRequest;
import org.codehaus.groovy.grails.web.servlet.view.GroovyPageViewResolver;
import org.codehaus.groovy.grails.web.util.WebUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.View;

/**
 * Overrides the default Grails view resolver and resolves scaffolded views at runtime.
 *
 * @author Graeme Rocher
 * @since 1.1
 */
public class ScaffoldingViewResolver extends GroovyPageViewResolver {

	GrailsTemplateGenerator templateGenerator;
	Map<String, List<String>> scaffoldedActionMap = Collections.emptyMap();
	Map<String, GrailsDomainClass> scaffoldedDomains = Collections.emptyMap();

	static final Map<String, View> scaffoldedViews = new ConcurrentHashMap<String, View>();
	protected static final Log log = LogFactory.getLog(ScaffoldingViewResolver.class);

	/**
	 * Clears any cached scaffolded views.
	 */
	public static void clearViewCache() {
		scaffoldedViews.clear();
	}

	@Override
	protected View createFallbackView(String viewName) throws Exception {
		GrailsWebRequest webRequest = GrailsWebRequest.lookup();

		String[] viewNameParts = splitViewName(viewName);
		if(viewNameParts.length == 1) {
		    viewName = WebUtils.addViewPrefix(viewName, webRequest.getControllerName());
		    viewNameParts = splitViewName(viewName);
		}

		View v = scaffoldedViews.get(viewName);
        if (v == null) {
			GrailsDomainClass domainClass = scaffoldedDomains.get(viewNameParts[0]);
			if (domainClass != null) {
				String viewCode = null;
				try {
					viewCode = generateViewSource(viewNameParts[1], domainClass);
				}
				catch (Exception e) {
					log.error("Error generating scaffolded view [" + viewName + "]: " + e.getMessage(),e);
				}
				if (StringUtils.hasLength(viewCode)) {
					v = createScaffoldedView(viewName, viewCode);
					scaffoldedViews.put(viewName, v);
				}
			}
        }
        if (v != null) {
            return v;
        }
		return super.createFallbackView(viewName);
	}

    protected String[] splitViewName(String viewName) {
        return org.apache.commons.lang.StringUtils.split(viewName, '/');
    }

	protected View createScaffoldedView(String viewName, String viewCode) throws Exception {
		final ScaffoldedGroovyPageView view = new ScaffoldedGroovyPageView(viewName, viewCode);
		view.setApplicationContext(getApplicationContext());
		view.setServletContext(getServletContext());
		view.setTemplateEngine(templateEngine);
		view.afterPropertiesSet();
		return view;
	}

	protected String generateViewSource(String viewName, GrailsDomainClass domainClass) throws IOException {
		Writer sw = new FastStringWriter();
		templateGenerator.generateView(domainClass, viewName,sw);
		return sw.toString();
	}

	public void setTemplateGenerator(GrailsTemplateGenerator templateGenerator) {
		this.templateGenerator = templateGenerator;
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	public void setScaffoldedActionMap(Map scaffoldedActionMap) {
		this.scaffoldedActionMap = scaffoldedActionMap;
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	public void setScaffoldedDomains(Map scaffoldedDomains) {
		this.scaffoldedDomains = scaffoldedDomains;
	}
}
