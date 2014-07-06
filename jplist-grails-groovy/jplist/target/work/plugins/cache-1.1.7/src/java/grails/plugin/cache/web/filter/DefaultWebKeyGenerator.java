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
package grails.plugin.cache.web.filter;

import javax.servlet.http.HttpServletRequest;

import org.codehaus.groovy.grails.web.util.WebUtils;
import org.springframework.util.StringUtils;

/**
 * Default implementation.
 *
 * @author Burt Beckwith
 */
public class DefaultWebKeyGenerator implements WebKeyGenerator {

	protected boolean supportAjax = false;

	public static final String X_REQUESTED_WITH = "X-Requested-With";

	public String generate(HttpServletRequest request) {

		String uri = WebUtils.getForwardURI(request);

		StringBuilder key = new StringBuilder();
		key.append(request.getMethod().toUpperCase());

		String format = WebUtils.getFormatFromURI(uri);
		if (StringUtils.hasLength(format) && !"all".equals(format)) {
			key.append(":format:").append(format);
		}

		if (supportAjax) {
			String requestedWith = request.getHeader(X_REQUESTED_WITH);
			if (StringUtils.hasLength(requestedWith)) {
				key.append(':').append(X_REQUESTED_WITH).append(':').append(requestedWith);
			}
		}

		key.append(':').append(uri);
		if (StringUtils.hasLength(request.getQueryString())) {
			key.append('?').append(request.getQueryString());
		}

		return key.toString();
	}

	public void setSupportAjax(boolean support) {
		supportAjax = support;
	}
}
