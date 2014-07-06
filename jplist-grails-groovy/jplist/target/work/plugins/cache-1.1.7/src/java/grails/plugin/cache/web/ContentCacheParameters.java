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
package grails.plugin.cache.web;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.codehaus.groovy.grails.commons.ControllerArtefactHandler;
import org.codehaus.groovy.grails.commons.GrailsControllerClass;
import org.codehaus.groovy.grails.web.servlet.mvc.GrailsParameterMap;
import org.codehaus.groovy.grails.web.servlet.mvc.GrailsWebRequest;
import org.springframework.util.StringUtils;

/**
 * Based on grails.plugin.springcache.web.ContentCacheParameters.
 *
 * @author Rob Fletcher
 * @author Burt Beckwith
 */
public class ContentCacheParameters {

	protected final GrailsWebRequest grailsWebRequest;

	/*@Lazy*/ protected GrailsControllerClass controllerClass;
	/*@Lazy*/ protected Method method;
	protected String actionName;

	public ContentCacheParameters(GrailsWebRequest request) {
		grailsWebRequest = request;
		// TODO these two were @Lazy in SpringCache
		initController();
		initAction();
	}

	public String getControllerName() {
		return grailsWebRequest.getControllerName();
	}

	public String getActionName() {
		if (actionName == null) {
			actionName = grailsWebRequest.getActionName();
			if (!StringUtils.hasLength(actionName) && controllerClass != null) {
				actionName = controllerClass.getDefaultAction();
			}
		}
		return actionName;
	}

	public Method getMethod() {
		return method;
	}

	public GrailsParameterMap getParams() {
		return grailsWebRequest.getParams();
	}

	public HttpServletRequest getRequest() {
		return grailsWebRequest.getCurrentRequest();
	}

	public Class<?> getControllerClass() {
		return controllerClass == null ? null : controllerClass.getClazz();
	}

	protected void initController() {
		controllerClass = (GrailsControllerClass) GrailsWebRequest.lookupApplication().getArtefactForFeature(
				ControllerArtefactHandler.TYPE, '/' + getControllerName());
	}

	protected void initAction() {
		if (controllerClass == null) {
			return;
		}

		getActionName();

		List<Method> matches = new ArrayList<Method>();
		for (Method m : controllerClass.getClazz().getMethods()) {
			if (m.getName().equals(actionName)) {
				matches.add(m);
			}
		}

		// if the controller class method has parameters, there will be two methods; one no-arg
		// and one with args that gets delegated to by the no-arg method. we need the one with
		// args if it exists
		if (matches.size() == 1) {
			method = matches.get(0);
		}
		else if (matches.size() > 1) {
			if (matches.get(0).getParameterTypes().length > 0) {
				method = matches.get(0);
			}
			else {
				method = matches.get(1);
			}
		}

		if (method == null) {
			// TODO scaffolded controller?
		}
	}

	@Override
	public String toString() {
		StringBuilder buffer = new StringBuilder("[");
		buffer.append("controller=").append(getControllerName());
		if (controllerClass == null) buffer.append("?");
		buffer.append(", action=").append(getActionName());
		if (method == null) buffer.append("?");
		buffer.append("]");
		return buffer.toString();
	}
}
