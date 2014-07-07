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

import java.io.Serializable;

import javax.servlet.http.Cookie;

/**
 * Based on net.sf.ehcache.constructs.web.SerializableCookie.
 *
 * @author Greg Luck
 * @author Adam Murdoch
 * @author Burt Beckwith
 */
public class SerializableCookie implements Serializable {

	private static final long serialVersionUID = 1;

	protected String name;
	protected String value;
	protected String comment;
	protected String domain;
	protected int maxAge;
	protected String path;
	protected boolean secure;
	protected int version;

	public SerializableCookie(final Cookie cookie) {
		name = cookie.getName();
		value = cookie.getValue();
		comment = cookie.getComment();
		domain = cookie.getDomain();
		maxAge = cookie.getMaxAge();
		path = cookie.getPath();
		secure = cookie.getSecure();
		version = cookie.getVersion();
	}

	public Cookie toCookie() {
		Cookie cookie = new Cookie(name, value);
		cookie.setComment(comment);
		if (domain != null) {
			cookie.setDomain(domain);
		}
		cookie.setMaxAge(maxAge);
		cookie.setPath(path);
		cookie.setSecure(secure);
		cookie.setVersion(version);
		return cookie;
	}
}
