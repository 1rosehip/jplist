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

import java.io.IOException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.CacheManager;
import org.springframework.context.ApplicationContext;
import org.springframework.util.Assert;
import org.springframework.web.context.support.WebApplicationContextUtils;
import org.springframework.web.filter.GenericFilterBean;

/**
 * Based on net.sf.ehcache.constructs.web.filter.Filter.
 *
 * @author Greg Luck
 * @author Burt Beckwith
 */
public abstract class AbstractFilter extends GenericFilterBean {

	/**
	 * If a request attribute NO_FILTER is set, then filtering will be skipped
	 */
	public static final String NO_FILTER = "NO_FILTER";

	protected final Logger log = LoggerFactory.getLogger(getClass());

	protected CacheManager cacheManager;
	protected Object nativeCacheManager;
	protected boolean suppressStackTraces;

	public final void doFilter(final ServletRequest req, final ServletResponse res, final FilterChain chain)
			throws ServletException, IOException {
		HttpServletRequest request = (HttpServletRequest)req;
		HttpServletResponse response = (HttpServletResponse)res;
		try {
			// NO_FILTER set for RequestDispatcher forwards to avoid double gzipping
			if (filterNotDisabled(request)) {
				doFilter(request, response, chain);
			}
			else {
				chain.doFilter(req, res);
			}
		}
		catch (Throwable throwable) {
			logThrowable(throwable, request);
		}
	}

	protected abstract void doFilter(final HttpServletRequest httpRequest, final HttpServletResponse httpResponse,
			final FilterChain chain) throws Throwable;

	/**
	 * Filters can be disabled programmatically by adding a {@link #NO_FILTER}
	 * parameter to the request. This parameter is normally added to make
	 * RequestDispatcher include and forwards work.
	 *
	 * @param httpRequest the request
	 * @return true if NO_FILTER is not set.
	 */
	protected boolean filterNotDisabled(final HttpServletRequest request) {
		return request.getAttribute(NO_FILTER) == null;
	}

	/**
	 * This method should throw IOExceptions, not wrap them.
	 */
	protected void logThrowable(final Throwable throwable, final HttpServletRequest httpRequest)
			throws ServletException, IOException {

		StringBuilder messageBuffer = new StringBuilder(
				"Throwable thrown during doFilter on request with URI: ")
				.append(httpRequest.getRequestURI())
				.append(" and Query: ")
				.append(httpRequest.getQueryString())
				.append(" : ")
				.append(throwable.getMessage());

		if (suppressStackTraces) {
			log.warn(messageBuffer
					.append("\nTop StackTraceElement: ")
					.append(throwable.getStackTrace()[0]).toString());
		}
		else {
			log.warn(messageBuffer.toString(), throwable);
		}

		if (throwable instanceof IOException) {
			throw (IOException)throwable;
		}

		throw new ServletException(throwable);
	}

	protected CacheManager getCacheManager() {
		return cacheManager;
	}

	protected Object getNativeCacheManager() {
		return nativeCacheManager;
	}

	protected boolean acceptsEncoding(final HttpServletRequest request, final String name) {
		return headerContains(request, "Accept-Encoding", name);
	}

	protected boolean headerContains(final HttpServletRequest request, final String header, final String value) {

		logRequestHeaders(request);

		for (Enumeration<String> accepted = request.getHeaders(header); accepted.hasMoreElements(); ) {
			String headerValue = accepted.nextElement();
			if (headerValue.indexOf(value) != -1) {
				return true;
			}
		}
		return false;
	}

	protected void logRequestHeaders(final HttpServletRequest request) {
		if (!log.isDebugEnabled()) {
			return;
		}

		Map<String, String> headers = new HashMap<String, String>();
		StringBuilder logLine = new StringBuilder("Request Headers");
		for (Enumeration<String> enumeration = request.getHeaderNames(); enumeration.hasMoreElements(); ) {
			String name = enumeration.nextElement();
			String headerValue = request.getHeader(name);
			headers.put(name, headerValue);
			logLine.append(": ").append(name).append(" -> ").append(headerValue);
		}
		log.debug(logLine.toString());
	}

	/**
	 * Determine whether the user agent accepts GZIP encoding. This feature is
	 * part of HTTP1.1. If a browser accepts GZIP encoding it will advertise this
	 * by including in its HTTP header:
	 * <p/>
	 * <code>
	 * Accept-Encoding: gzip
	 * </code>
	 * <p/>
	 * Requests which do not accept GZIP encoding fall into the following
	 * categories:
	 * <ul>
	 * <li>Old browsers, notably IE 5 on Macintosh.
	 * <li>Search robots such as yahoo. While there are quite a few bots, they
	 * only hit individual pages once or twice a day. Note that Googlebot as of
	 * August 2004 now accepts GZIP.
	 * <li>Internet Explorer through a proxy. By default HTTP1.1 is enabled but
	 * disabled when going through a proxy. 90% of non gzip requests are caused
	 * by this.
	 * <li>Site monitoring tools
	 * </ul>
	 * As of September 2004, about 34% of requests coming from the Internet did
	 * not accept GZIP encoding.
	 *
	 * @param request
	 * @return true, if the User Agent request accepts GZIP encoding
	 */
	protected boolean acceptsGzipEncoding(HttpServletRequest request) {
		return acceptsEncoding(request, "gzip");
	}

	// TODO remove, use DI
	@SuppressWarnings("unchecked")
	protected <T> T getBean(String name) {
		ApplicationContext ctx = WebApplicationContextUtils.getRequiredWebApplicationContext(
				getServletContext());
		return (T)ctx.getBean(name);
	}

	/**
	 * Dependency injection for the cache manager.
	 * @param cacheManager the manager
	 */
	public void setCacheManager(CacheManager manager) {
		cacheManager = manager;
	}

	/**
	 * Dependency injection for the native cache manager.
	 * @param nativeCacheManager the manager
	 */
	public void setNativeCacheManager(Object manager) {
		nativeCacheManager = manager;
	}

	/**
	 * Dependency injection for whether to suppress stacktraces.
	 * @param suppress if true only log the message
	 */
	public void setSuppressStackTraces(boolean suppress) {
		suppressStackTraces = suppress;
	}

	@Override
	public void afterPropertiesSet() throws ServletException {
		super.afterPropertiesSet();
		Assert.notNull(cacheManager, "cacheManager is required");
//		Assert.notNull(nativeCacheManager, "nativeCacheManager is required");
		if (suppressStackTraces && log.isDebugEnabled()) {
			log.debug("Suppression of stack traces enabled for {}", getClass().getName());
		}
	}
}
