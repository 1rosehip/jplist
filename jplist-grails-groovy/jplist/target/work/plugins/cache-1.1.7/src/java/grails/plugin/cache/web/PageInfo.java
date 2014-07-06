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

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.codehaus.groovy.grails.plugins.web.api.ControllersApi;
import org.codehaus.groovy.grails.web.servlet.GrailsFlashScope;
import org.codehaus.groovy.grails.web.servlet.HttpHeaders;
import org.codehaus.groovy.grails.commons.*;
import org.slf4j.LoggerFactory;
import org.springframework.aop.PointcutAdvisor;
import org.springframework.aop.TargetSource;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.FlashMap;

/**
 * A Serializable representation of a {@link HttpServletResponse}.
 *
 * Based on net.sf.ehcache.constructs.web.PageInfo and grails.plugin.springcache.web.HeadersCategory.
 *
 * @author Adam Murdoch
 * @author Greg Luck
 * @author Rob Fletcher
 * @author Burt Beckwith
 */
public class PageInfo implements Serializable {
	private static final long serialVersionUID = 1;

	protected static final Pattern PATTERN_CACHE_DIRECTIVE = Pattern.compile("([\\w-]+)(?:=(.+))?");
	protected static final int FOUR_KB = 4196;
	protected static final int GZIP_MAGIC_NUMBER_BYTE_1 = 31;
	protected static final int GZIP_MAGIC_NUMBER_BYTE_2 = -117;
	protected static final long ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;
	protected static final java.util.Set<String> IGNORED_INTERFACES = new java.util.HashSet<String>() {{
		add("net.sf.cglib.proxy");
		add("javassist.util.proxy.ProxyObject");
	}};


	protected final HttpDateFormatter httpDateFormatter = new HttpDateFormatter();
	protected final List<Header<? extends Serializable>> responseHeaders = new ArrayList<Header<? extends Serializable>>();
	protected final List<SerializableCookie> serializableCookies = new ArrayList<SerializableCookie>();
	protected Map<String, Serializable> requestAttributes;
	protected String contentType;
	protected byte[] gzippedBody;
	protected byte[] ungzippedBody;
	protected int statusCode;
	protected boolean storeGzipped;
	protected Date created;
	protected long timeToLiveSeconds;

	/**
	 * Creates a PageInfo object representing the "page".
	 *
	 * @param statusCode
	 * @param contentType
	 * @param cookies
	 * @param body
	 * @param storeGzipped set this to false for images and page fragments which should never
	 * @param timeToLiveSeconds the time to Live in seconds. 0 means maximum, which is one year per RFC2616.
	 * @param headers
	 * @param cookies
	 * @param requestAttributes
	 * @throws AlreadyGzippedException
	 */
	public PageInfo(final int statusCode, final String contentType, final byte[] body,
	        boolean storeGzipped, long timeToLiveSeconds, final Collection<Header<? extends Serializable>> headers,
	        @SuppressWarnings("unused") final Collection<Cookie> cookies,
	        Map<String, Serializable> requestAttributes) throws AlreadyGzippedException {

		if (headers != null) {
			responseHeaders.addAll(headers);
		}
		setTimeToLiveWithCheckForNeverExpires(timeToLiveSeconds);

		created = new Date();
		this.contentType = contentType;
		this.storeGzipped = storeGzipped;
		this.statusCode = statusCode;
		setCacheableRequestAttributes(requestAttributes);

		// bug 2630970
		// extractCookies(cookies);

		try {
			if (storeGzipped) {
				// gunzip on demand
				ungzippedBody = null;
				if (isBodyParameterGzipped()) {
					gzippedBody = body;
				}
				else {
					gzippedBody = gzip(body);
				}
			}
			else {
				Assert.isTrue(!isBodyParameterGzipped(), "Non gzip content has been gzipped.");
				ungzippedBody = body;
			}
		}
		catch (IOException e) {
			LoggerFactory.getLogger(getClass()).error("Error ungzipping gzipped body", e);
		}
	}

	/**
	 * See http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html To mark a
	 * response as "never expires," an origin server sends an Expires date
	 * approximately one year from the time the response is sent. HTTP/1.1
	 * servers SHOULD NOT send Expires dates more than one year in the future.
	 *
	 * @param ttlSeconds
	 *           accepts 0, which means eternal. If the time is 0 or > one year,
	 *           it is set to one year in accordance with the RFC.
	 *           <p/>
	 *           Note: PageInfo does not hold a reference to the Element
	 *           and therefore does not know what the Element ttl is. It would
	 *           normally make most sense to set the TTL to the same as the
	 *           element expiry.
	 */
	protected void setTimeToLiveWithCheckForNeverExpires(long ttlSeconds) {
		// 0 means eternal
		if (ttlSeconds == 0 || ttlSeconds > ONE_YEAR_IN_SECONDS) {
			timeToLiveSeconds = ONE_YEAR_IN_SECONDS;
		}
		else {
			timeToLiveSeconds = ttlSeconds;
		}
	}

	/**
	 * @param ungzipped the bytes to be gzipped
	 * @return gzipped bytes
	 */
	protected byte[] gzip(byte[] ungzipped) throws IOException, AlreadyGzippedException {
		if (isGzipped(ungzipped)) {
			throw new AlreadyGzippedException("The byte[] is already gzipped. It should not be gzipped again.");
		}
		ByteArrayOutputStream bytes = new ByteArrayOutputStream();
		GZIPOutputStream gzipOutputStream = new GZIPOutputStream(bytes);
		gzipOutputStream.write(ungzipped);
		gzipOutputStream.close();
		return bytes.toByteArray();
	}

	/**
	 * The response body will be assumed to be gzipped if the GZIP header has been set.
	 *
	 * @return true if the body is gzipped
	 */
	protected boolean isBodyParameterGzipped() {
		for (Header<? extends Serializable> header : responseHeaders) {
			if ("gzip".equals(header.getValue())) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Checks the first two bytes of the candidate byte array for the magic
	 * number 0x677a. This magic number was obtained from /usr/share/file/magic.
	 * The line for gzip is:
	 * <p/>
	 * <code>
	 * >>14    beshort 0x677a          (gzipped)
	 * </code>
	 *
	 * @param candidate the byte array to check
	 * @return true if gzipped, false if null, less than two bytes or not gzipped
	 */
	public static boolean isGzipped(byte[] candidate) {
		if (candidate == null || candidate.length < 2) {
			return false;
		}
		return (candidate[0] == GZIP_MAGIC_NUMBER_BYTE_1 && candidate[1] == GZIP_MAGIC_NUMBER_BYTE_2);
	}

	/**
	 * @return the content type of the response.
	 */
	public String getContentType() {
		return contentType;
	}

	/**
	 * @return the gzipped version of the body if the content is storeGzipped, otherwise null
	 */
	public byte[] getGzippedBody() {
		return storeGzipped ? gzippedBody : null;
	}

	/**
	 * @return All of the headers set on the page
	 */
	public List<Header<? extends Serializable>> getHeaders() {
		return responseHeaders;
	}

	/**
	 * Returns the cookies of the response.
	 */
	public List<SerializableCookie> getSerializableCookies() {
		return serializableCookies;
	}

	/**
	 * Returns the status code of the response.
	 */
	public int getStatusCode() {
		return statusCode;
	}

	/**
	 * @return the ungzipped version of the body. This gunzipped on demand when
	 *         storedGzipped, otherwise the ungzipped body is returned.
	 */
	public byte[] getUngzippedBody() throws IOException {
		return storeGzipped ? ungzip(gzippedBody) : ungzippedBody;
	}

	/**
	 * A highly performant ungzip implementation. Do not refactor this without
	 * taking new timings. See ElementTest for timings
	 *
	 * @param gzipped the gzipped content
	 * @return an ungzipped byte[]
	 * @throws IOException
	 */
	protected byte[] ungzip(final byte[] gzipped) throws IOException {
		GZIPInputStream inputStream = new GZIPInputStream(new ByteArrayInputStream(gzipped));
		ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream(gzipped.length);
		byte[] buffer = new byte[FOUR_KB];
		int bytesRead = 0;
		while (bytesRead != -1) {
			bytesRead = inputStream.read(buffer, 0, FOUR_KB);
			if (bytesRead != -1) {
				byteArrayOutputStream.write(buffer, 0, bytesRead);
			}
		}
		byte[] ungzipped = byteArrayOutputStream.toByteArray();
		inputStream.close();
		byteArrayOutputStream.close();
		return ungzipped;
	}

	/**
	 * @return true if there is a non null gzipped body
	 */
	public boolean hasGzippedBody() {
		return gzippedBody != null;
	}

	/**
	 * @return true if there is a non null ungzipped body
	 */
	public boolean hasUngzippedBody() {
		return ungzippedBody != null;
	}

	/**
	 * Returns true if the response is Ok.
	 *
	 * @return true if the response code is 200.
	 */
	public boolean isOk() {
		return statusCode == HttpServletResponse.SC_OK;
	}

	/**
	 * The <code>Date</code> this PageInfo object was created
	 */
	public Date getCreated() {
		return created;
	}

	/**
	 * The time to live in seconds.
	 *
	 * @return the time to live, or 0 if the wrapping element is eternal
	 */
	public long getTimeToLiveSeconds() {
		return timeToLiveSeconds;
	}

	public Map<String, Serializable> getRequestAttributes() {
		return Collections.unmodifiableMap(requestAttributes);
	}

	public String getHeader(String headerName) {
		for (Header<? extends Serializable> header : responseHeaders) {
			if (header.getName().equals(headerName)) {
				return (String)header.getValue();
			}
		}
		return null;
	}

	public long getDateHeader(String headerName) {
		String header = getHeader(headerName);
		if (!StringUtils.hasLength(header)) {
			return -1;
		}

		try {
			return Long.valueOf(header);
		}
		catch (NumberFormatException e) {
			return httpDateFormatter.parseDateFromHttpDate(header).getTime();
		}
	}

	/**
	 * Returns true if the page's last-modified header indicates it is newer than
	 * the copy held by the client as indicated by the request's if-modified-since header.
	 */
	public boolean isModified(HttpServletRequest request) {
		long ifModifiedSince = request.getDateHeader(HttpHeaders.IF_MODIFIED_SINCE);
		long lastModified = getDateHeader(HttpHeaders.LAST_MODIFIED);
		if (ifModifiedSince == -1 || lastModified == -1) {
			return true;
		}
		return lastModified > ifModifiedSince;
	}

	/**
	 * Returns true if the page's etag header indicates it is the same as the
	 * copy held by the client as indicated by the request's if-none-match
	 * header.
	 */
	public boolean isMatch(HttpServletRequest request) {
		String ifNoneMatch = request.getHeader(HttpHeaders.IF_NONE_MATCH);
		String etag = getHeader(HttpHeaders.ETAG);
		if (!StringUtils.hasLength(ifNoneMatch) || !StringUtils.hasLength(etag)) {
			return false;
		}

		return ifNoneMatch == etag;
	}

	public Map<String, Object> getCacheDirectives() {
		String cacheControl = getHeader(HttpHeaders.CACHE_CONTROL);
		Map<String, Object> directives = new HashMap<String, Object>();
		if (StringUtils.hasLength(cacheControl)) {
			for (String directive : cacheControl.split(",\\s*")) {
				Matcher matcher = PATTERN_CACHE_DIRECTIVE.matcher(directive);
				if (!matcher.find()) {
					continue;
				}

				String name = matcher.group(1);
				String value = matcher.group(2);
				if (StringUtils.hasLength(value)) {
					try {
						directives.put(name, Integer.valueOf(value));
					}
					catch (NumberFormatException e) {
						directives.put(name, value);
					}
				}
				else {
					directives.put(name, true);
				}
			}
		}
		return directives;
	}

	protected void setCacheableRequestAttributes(Map<String, Serializable> attributes) {
		requestAttributes = new HashMap<String, Serializable>();

		for (Map.Entry<String, Serializable> entry : attributes.entrySet()) {
			Serializable value = entry.getValue();

			if (value instanceof GrailsFlashScope) {
				continue;
			}
			else if (value instanceof FlashMap) {
				continue;
			}
			else if (value instanceof HttpServletResponse) {
				continue;
			}
			else if (value instanceof ControllersApi) {
				continue;
			}
			else if (value instanceof PointcutAdvisor || value instanceof PointcutAdvisor[]) {
				continue;
			}
			else if (value instanceof TargetSource) {
				continue;
			}
			else if(isInvalidObject(value)) {
				continue;
			}

			requestAttributes.put(entry.getKey(), value);
		}
	}

	protected boolean isInvalidObject(Object object) {
			Class[] interfaces = GrailsClassUtils.getAllInterfaces(object);
			for(Class i : interfaces) {
				if(IGNORED_INTERFACES.contains(i.getName())) {
					return true;
				}
			}
			return false;
	}
}
