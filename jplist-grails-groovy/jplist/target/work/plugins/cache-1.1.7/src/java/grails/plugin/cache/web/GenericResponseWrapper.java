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

import grails.plugin.cache.SerializableOutputStream;
import grails.plugin.cache.web.Header.Type;
import javassist.util.proxy.*;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.Serializable;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;


/**
 * Provides a wrapper for {@link javax.servlet.http.HttpServletResponseWrapper}.
 * <p/>
 * It is used to wrap the real Response so that we can modify it after that the
 * target of the request has delivered its response.
 * <p/>
 * It uses the Wrapper pattern.
 *
 * Based on net.sf.ehcache.constructs.web.GenericResponseWrapper.
 *
 * @author Greg Luck
 * @author Burt Beckwith
 */
@SuppressWarnings("deprecation")
public class GenericResponseWrapper extends HttpServletResponseWrapper implements Serializable {

  private static final long serialVersionUID = 1;
  public static final Log LOG = LogFactory.getLog(GenericResponseWrapper.class);

  protected int statusCode = SC_OK;
	protected int contentLength;
	protected String contentType;
	protected final Map<String, List<Serializable>> headersMap = new TreeMap<String, List<Serializable>>(
			String.CASE_INSENSITIVE_ORDER);
	protected final List<Cookie> cookies = new ArrayList<Cookie>();
	protected ServletOutputStream out;
	protected transient PrintWriter writer;
	protected boolean disableFlushBuffer = true;

  static {
    ProxyFactory.classLoaderProvider = new ProxyFactory.ClassLoaderProvider() {
      public ClassLoader get(ProxyFactory pf) {
          return Thread.currentThread().getContextClassLoader();
      }
    };
  }

	/**
	 * Creates a GenericResponseWrapper
	 */
	public GenericResponseWrapper(final HttpServletResponse response, final SerializableOutputStream outputStream) {
		super(response);

    ProxyFactory factory = new ProxyFactory();

    factory.setSuperclass(ServletOutputStream.class);
    Class clazz = factory.createClass();

    try {
      this.out = (ServletOutputStream)clazz.newInstance();
      MethodHandler handler = new MethodHandler() {

              public Object invoke(Object o, Method method, Method forwarder, Object[] args) throws Throwable {
                  if("write".equals(method.getName())) {
                      switch(args.length) {
                          case 1:
                              Object arg = args[0];
                              if(arg instanceof Integer) {
                                  outputStream.write((Integer)arg);
                              }
                              else {
                                  outputStream.write((byte[])arg);
                              }
                          case 3:
                              outputStream.write((byte[])args[0], (Integer)args[1], (Integer)args[2]);
                      }
                      return null;
                  }
                  else {
                      return forwarder.invoke(o, args);
                  }
              }
        };

        ((ProxyObject) out).setHandler(handler);
    }
    catch(Exception e) {
          throw new RuntimeException("Cannot create output stream proxy: " + e.getMessage(), e);
    }


	}

	@Override
	public ServletOutputStream getOutputStream() {
		return out;
	}

	@Override
	public void setStatus(final int code) {
		statusCode = code;
		super.setStatus(code);
	}

	/**
	 * Send the error. If the response is not ok, most of the logic is bypassed
	 * and the error is sent raw Also, the content is not cached.
	 *
	 * @param code the status code
	 * @param string the error message
	 * @throws IOException
	 */
	@Override
	public void sendError(int code, String string) throws IOException {
		statusCode = code;
		super.sendError(code, string);
	}

	/**
	 * Send the error. If the response is not ok, most of the logic is bypassed
	 * and the error is sent raw Also, the content is not cached.
	 *
	 * @param code the status code
	 * @throws IOException
	 */
	@Override
	public void sendError(int code) throws IOException {
		statusCode = code;
		super.sendError(code);
	}

	/**
	 * Send the redirect. If the response is not ok, most of the logic is
	 * bypassed and the error is sent raw. Also, the content is not cached.
	 *
	 * @param string the URL to redirect to
	 * @throws IOException
	 */
	@Override
	public void sendRedirect(String string) throws IOException {
		statusCode = HttpServletResponse.SC_MOVED_TEMPORARILY;
		super.sendRedirect(string);
	}

	@Override
	public void setStatus(final int code, final String msg) {
		statusCode = code;
		LOG.warn("Discarding message because this method is deprecated.");
		super.setStatus(code);
	}

	// don't add @Override since it's only a method as of Servlet 3.0
	public int getStatus() {
		return statusCode;
	}

	@Override
	public void setContentLength(final int length) {
		contentLength = length;
		super.setContentLength(length);
	}

	public int getContentLength() {
		return contentLength;
	}

	@Override
	public void setContentType(final String type) {
		contentType = type;
		super.setContentType(type);
	}

	@Override
	public String getContentType() {
		return contentType;
	}

	@Override
	public PrintWriter getWriter() throws IOException {
		if (writer == null) {
			writer = new PrintWriter(new OutputStreamWriter(out, getCharacterEncoding()), true);
		}
		return writer;
	}

	@Override
	public void addHeader(String name, String value) {
		List<Serializable> values = headersMap.get(name);
		if (values == null) {
			values = new LinkedList<Serializable>();
			headersMap.put(name, values);
		}
		values.add(value);

		super.addHeader(name, value);
	}

	@Override
	public void setHeader(String name, String value) {
		LinkedList<Serializable> values = new LinkedList<Serializable>();
		values.add(value);
		headersMap.put(name, values);

		super.setHeader(name, value);
	}

	@Override
	public void addDateHeader(String name, long date) {
		List<Serializable> values = headersMap.get(name);
		if (values == null) {
			values = new LinkedList<Serializable>();
			headersMap.put(name, values);
		}
		values.add(date);

		super.addDateHeader(name, date);
	}

	@Override
	public void setDateHeader(String name, long date) {
		LinkedList<Serializable> values = new LinkedList<Serializable>();
		values.add(date);
		headersMap.put(name, values);

		super.setDateHeader(name, date);
	}

	@Override
	public void addIntHeader(String name, int value) {
		List<Serializable> values = headersMap.get(name);
		if (values == null) {
			values = new LinkedList<Serializable>();
			headersMap.put(name, values);
		}
		values.add(value);

		super.addIntHeader(name, value);
	}

	@Override
	public void setIntHeader(String name, int value) {
		LinkedList<Serializable> values = new LinkedList<Serializable>();
		values.add(value);
		headersMap.put(name, values);

		super.setIntHeader(name, value);
	}

	public Collection<Header<? extends Serializable>> getAllHeaders() {
		List<Header<? extends Serializable>> headers = new LinkedList<Header<? extends Serializable>>();

		for (Map.Entry<String, List<Serializable>> headerEntry : headersMap.entrySet()) {
			String name = headerEntry.getKey();
			for (Serializable value : headerEntry.getValue()) {

				// Null Check for value before doing value.getClass()
				// FIX for: http://jira.grails.org/browse/GPCACHE-37
				if(value != null) {

					Type type = Header.Type.determineType(value.getClass());
					switch (type) {
						case STRING:
							headers.add(new Header<String>(name, (String)value));
							break;
						case DATE:
							headers.add(new Header<Long>(name, (Long)value));
							break;
						case INT:
							headers.add(new Header<Integer>(name, (Integer)value));
							break;
						default:
							throw new IllegalArgumentException("No mapping for Header.Type: " + type);
					}
				}
			}
		}

		return headers;
	}

	@Override
	public void addCookie(final Cookie cookie) {
		cookies.add(cookie);
		super.addCookie(cookie);
	}

	public Collection<Cookie> getCookies() {
		return cookies;
	}

	@Override
	public void flushBuffer() throws IOException {
		flush();

		// doing this might leads to response already committed exception when the
		// PageInfo has not yet built but the buffer already flushed. Happens in WebLogic
		// when a servlet forward to a JSP page and the forward method trigger a flush
		// before it forwarded to the JSP disableFlushBuffer for that purpose is 'true' by default
		// EHC-447
		if (!disableFlushBuffer) {
			super.flushBuffer();
		}
	}

	@Override
	public void reset() {
		super.reset();
		cookies.clear();
		headersMap.clear();
		statusCode = SC_OK;
		contentType = null;
		contentLength = 0;
	}

	/**
	 * Flushes all the streams for this response.
	 */
	public void flush() throws IOException {
		if (writer != null) {
			writer.flush();
		}
		out.flush();
	}

	/**
	 * Is the wrapped reponse's buffer flushing disabled?
	 *
	 * @return true if the wrapped reponse's buffer flushing disabled
	 */
	public boolean isDisableFlushBuffer() {
		return disableFlushBuffer;
	}

	/**
	 * Set if the wrapped reponse's buffer flushing should be disabled.
	 *
	 * @param disable true if the wrapped reponse's buffer flushing should be disabled
	 */
	public void setDisableFlushBuffer(boolean disable) {
		disableFlushBuffer = disable;
	}
}
