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

import grails.plugin.cache.GrailsAnnotationCacheOperationSource;
import grails.plugin.cache.SerializableByteArrayOutputStream;
import grails.plugin.cache.Timer;
import grails.plugin.cache.web.ContentCacheParameters;
import grails.plugin.cache.web.GenericResponseWrapper;
import grails.plugin.cache.web.Header;
import grails.plugin.cache.web.PageInfo;
import grails.plugin.cache.web.SerializableCookie;
import grails.util.GrailsNameUtils;

import java.io.IOException;
import java.io.Serializable;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Stack;
import java.util.TreeSet;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.codehaus.groovy.grails.plugins.web.api.RequestMimeTypesApi;
import org.codehaus.groovy.grails.web.servlet.GrailsApplicationAttributes;
import org.codehaus.groovy.grails.web.servlet.HttpHeaders;
import org.codehaus.groovy.grails.web.servlet.WrappedResponseHolder;
import org.codehaus.groovy.grails.web.servlet.mvc.GrailsParameterMap;
import org.codehaus.groovy.grails.web.servlet.mvc.GrailsWebRequest;
import org.codehaus.groovy.grails.web.util.WebUtils;
import org.springframework.aop.framework.AopProxyUtils;
import org.springframework.cache.Cache;
import org.springframework.cache.Cache.ValueWrapper;
import org.springframework.cache.interceptor.CacheEvictOperation;
import org.springframework.cache.interceptor.CacheOperation;
import org.springframework.cache.interceptor.CachePutOperation;
import org.springframework.cache.interceptor.CacheableOperation;
import org.springframework.core.LocalVariableTableParameterNameDiscoverer;
import org.springframework.core.ParameterNameDiscoverer;
import org.springframework.util.Assert;
import org.springframework.util.ClassUtils;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ReflectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;

/**
 * A simple page fragment {@link CachingFilter} suitable for most uses.
 * <p/>
 * The meaning of <i>page fragment</i> is:
 * <ul>
 * <li>An include into an outer page.
 * <li>A content type suitable for suitable for inclusion into the outer page.
 * e.g. text or text/html
 * </ul>
 * For full page see {@link SimplePageCachingFilter}.
 * <h3>Keys</h3> Pages are cached based on their key. The key for this cache is
 * the URI followed by the query string. An example is
 * <code>/admin/SomePage.jsp?id=1234&name=Beagle</code>.
 * <p/>
 * This key technique is suitable for a wide range of uses. It is independent of
 * hostname and port number, so will work well in situations where there are
 * multiple domains which get the same content, or where users access based on
 * different port numbers.
 * <p/>
 * A problem can occur with tracking software, where unique ids are inserted
 * into request query strings. Because each request generates a unique key,
 * there will never be a cache hit. For these situations it is better to parse
 * the request parameters and override
 * {@link #calculateKey(javax.servlet.http.HttpServletRequest)} with an
 * implementation that takes account of only the significant ones.
 * <h3>Configuring Caching with ehcache</h3> A cache entry in ehcache.xml should
 * be configured with the name {@link #NAME}.
 * <p/>
 * Cache attributes including expiry are configured per cache name. To specify a
 * different behaviour simply subclass, specify a new name and create a separate
 * cache entry for it.
 * <h3>Gzipping</h3> Page fragments should never be gzipped.
 * <p/>
 * Page fragments are stored in the cache ungzipped.
 *
 * Based on net.sf.ehcache.constructs.web.filter.SimplePageFragmentCachingFilter,
 * grails.plugin.springcache.web.GrailsFragmentCachingFilter, and
 * org.springframework.cache.interceptor.CacheAspectSupport
 *
 * @author Greg Luck
 * @author Rob Fletcher
 * @author Costin Leau
 * @author Juergen Hoeller
 * @author Chris Beams
 * @author Burt Beckwith
 */
public abstract class PageFragmentCachingFilter extends AbstractFilter {

	public static final String X_CACHED = "X-Grails-Cached";

	protected static final String CACHEABLE = "cacheable";
	protected static final String UPDATE = "cacheupdate";
	protected static final String EVICT = "cacheevict";

	// TODO share with ExpressionEvaluator
	protected ParameterNameDiscoverer paramNameDiscoverer = new LocalVariableTableParameterNameDiscoverer();

	@SuppressWarnings("unchecked")
	protected static final Map<Class<?>, String> TYPE_TO_CONVERSION_METHOD_NAME = grails.util.CollectionUtils.<Class<?>, String>newMap(
			Boolean.class,   "boolean",
			Byte.class,      "byte",
			Character.class, "char",
			Double.class,    "double",
			Float.class,     "float",
			Integer.class,   "int",
			Long.class,      "long",
			Short.class,     "short");
	protected static List<Class<?>> PRIMITIVE_CLASSES = grails.util.CollectionUtils.<Class<?>>newList(
			boolean.class,
			byte.class,
			char.class,
			double.class,
			float.class,
			int.class,
			long.class,
			short.class);
	protected static final Map<String, Method> PARAMS_METHODS = new HashMap<String, Method>();
	static {
		for (String typeName : TYPE_TO_CONVERSION_METHOD_NAME.values()) {
			String methodName = GrailsNameUtils.getGetterName(typeName);
			Method method = ClassUtils.getMethod(GrailsParameterMap.class, methodName, String.class);
			PARAMS_METHODS.put(typeName, method);
		}
	}

	protected GrailsAnnotationCacheOperationSource cacheOperationSource;

	protected final ThreadLocal<Stack<ContentCacheParameters>> contextHolder = new ThreadLocal<Stack<ContentCacheParameters>>() {
		@Override
		protected Stack<ContentCacheParameters> initialValue() {
			return new Stack<ContentCacheParameters>();
		}
	};

	protected ExpressionEvaluator expressionEvaluator;
	protected WebKeyGenerator keyGenerator;

	@Override
	protected void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws Exception {
// TODO need blocking cache stuff from CachingFilter
		initContext();

		try {

			Object controller = lookupController(getContext().getControllerClass());
			if (controller == null) {
				log.debug("Not a controller request {}:{} {}",
						new Object[] { request.getMethod(), request.getRequestURI(), getContext() });
				chain.doFilter(request, response);
				return;
			}

			Class<?> controllerClass = AopProxyUtils.ultimateTargetClass(controller);
			if (controllerClass == null) {
				controllerClass = controller.getClass();
			}
			Method method = getContext().getMethod();
			if (method == null) {
				log.debug("No cacheable method found for {}:{} {}",
						new Object[] { request.getMethod(), request.getRequestURI(), getContext() });
				chain.doFilter(request, response);
				return;
			}
			Collection<CacheOperation> cacheOperations = cacheOperationSource.getCacheOperations(
					method, controllerClass, true);

			if (CollectionUtils.isEmpty(cacheOperations)) {
				log.debug("No cacheable annotation found for {}:{} {}",
						new Object[] { request.getMethod(), request.getRequestURI(), getContext() });
				chain.doFilter(request, response);
				return;
			}

			Map<String, Collection<CacheOperationContext>> operationsByType = createOperationContext(
					cacheOperations, method, controllerClass, request);

			// start with evictions
			if (inspectBeforeCacheEvicts(operationsByType.get(EVICT))) {
				chain.doFilter(request, response);
				return;
			}

			// follow up with cacheable
			CacheStatus status = inspectCacheables(operationsByType.get(CACHEABLE));

			Map<CacheOperationContext, Object> updates = inspectCacheUpdates(operationsByType.get(UPDATE));

			if (status != null) {
				if (status.updateRequired) {
					updates.putAll(status.updates);
				}
				// render cached response
				else {
					logRequestDetails(request, getContext(), "Caching enabled for request");
					PageInfo pageInfo = buildCachedPageInfo(request, response, status);
					writeResponse(request, response, pageInfo);
					return;
				}
			}

			logRequestDetails(request, getContext(), "Caching enabled for request");
			PageInfo pageInfo = buildNewPageInfo(request, response, chain, status, operationsByType);
			writeResponse(request, response, pageInfo);

			inspectAfterCacheEvicts(operationsByType.get(EVICT));

			if (!updates.isEmpty()) {
				Collection<Cache> caches = new ArrayList<Cache>();
				for (Map.Entry<CacheOperationContext, Object> entry : updates.entrySet()) {
					for (Cache cache : entry.getKey().getCaches()) {
						caches.add(cache);
					}
				}
				update(caches, pageInfo, status, calculateKey(request));
			}
		}
		finally {
			destroyContext();
		}
	}

	protected PageInfo buildNewPageInfo(HttpServletRequest request, HttpServletResponse response,
			FilterChain chain, CacheStatus cacheStatus,
			Map<String, Collection<CacheOperationContext>> operationsByType) throws Exception {

		Timer timer = new Timer(getCachedUri(request));
		timer.start();

		String key = calculateKey(request);
		PageInfo pageInfo;
		try {
			// Page is not cached - build the response, cache it, and send to client
			pageInfo = buildPage(request, response, chain);
			if (pageInfo.isOk()) {
				Object noCache = pageInfo.getCacheDirectives().get("no-cache");
				if (noCache instanceof Boolean && ((Boolean)noCache)) {
					log.debug("Response ok but Cache-Control: no-cache is present, not caching");
					releaseCacheLocks(operationsByType, key);
				}
				else {
					Collection<Cache> caches = new ArrayList<Cache>();
					for (CacheOperationContext operationContext : operationsByType.get(UPDATE)) {
						for (Cache cache : operationContext.getCaches()) {
							caches.add(cache);
						}
					}
					update(caches, pageInfo, cacheStatus, key);
				}
			}
			else {
				for (CacheOperationContext operationContext : operationsByType.get(UPDATE)) {
					for (Cache cache : operationContext.getCaches()) {
						log.debug("Response not ok ({}). Putting null into cache {} with key {}",
								new Object[] { pageInfo.getStatusCode(), cache.getName(), key } );
					}
				}
				releaseCacheLocks(operationsByType, key);
			}
		}
		catch (Exception e) {
            if("net.sf.ehcache.constructs.blocking.LockTimeoutException".equals(e.getClass().getName())) {
			    //do not release the lock, because you never acquired it
			    throw e;
            }
			// Must unlock the cache if the above fails. Will be logged at Filter
			releaseCacheLocks(operationsByType, key);
			throw e;
		}

		timer.stop(false);
		response.addHeader(X_CACHED, String.valueOf(false));
		return pageInfo;
	}

	protected PageInfo buildCachedPageInfo(HttpServletRequest request, HttpServletResponse response,
			CacheStatus cacheStatus) throws Exception {

		Timer timer = new Timer(getCachedUri(request));
		timer.start();

		String key = calculateKey(request);
		PageInfo pageInfo;
		ValueWrapper element = cacheStatus.valueWrapper;
		log.debug("Serving cached content for {}", key);
		pageInfo = (PageInfo) element.get();

		for (Map.Entry<String, ? extends Serializable> entry : pageInfo.getRequestAttributes().entrySet()) {
			request.setAttribute(entry.getKey(), entry.getValue());
		}

		// As the page is cached, we need to add an instance of the associated
		// controller to the request. This is required by GrailsLayoutDecoratorMapper
		// to pick the appropriate layout.
		if (StringUtils.hasLength(getContext().getControllerName())) {
			Object controller = lookupController(getContext().getControllerClass());
			request.setAttribute(GrailsApplicationAttributes.CONTROLLER, controller);
		}
		timer.stop(true);
		response.addHeader(X_CACHED, String.valueOf(true));
		return pageInfo;
	}

	protected abstract int getTimeToLive(ValueWrapper element);

	/**
	 * Store the PageInfo in the cache with the specified ttl.
	 * @param cache the cache
	 * @param key the key
	 * @param pageInfo the info
	 * @param timeToLive the ttl
	 */
	protected abstract void put(Cache cache, String key, PageInfo pageInfo, Integer timeToLive);

	protected void releaseCacheLocks(Map<String, Collection<CacheOperationContext>> operationsByType, String key) {
//		/*Blocking*/Cache cache
		// TODO is this needed since inspectBeforeCacheEvicts seems to do the right thing?

		for (CacheOperationContext operationContext : operationsByType.get(EVICT)) {
			for (Cache cache : operationContext.getCaches()) {
				put(cache, key, null, null);
			}
		}
	}

	protected PageInfo buildPage(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {
		// Invoke the next entity in the chain
		SerializableByteArrayOutputStream out = new SerializableByteArrayOutputStream();
		GenericResponseWrapper wrapper = new GenericResponseWrapper(response, out);
		Map<String, Serializable> cacheableRequestAttributes = new HashMap<String, Serializable>();

		// TODO: split the special include handling out into a separate method
		HttpServletResponse originalResponse = null;
		boolean isInclude = WebUtils.isIncludeRequest(request);
		if (isInclude) {
			originalResponse = WrappedResponseHolder.getWrappedResponse();
			WrappedResponseHolder.setWrappedResponse(wrapper);
		}
		try {
			List<String> attributesBefore = toList(request.getAttributeNames());
			chain.doFilter(request, wrapper);
			List<String> attributesAfter = toList(request.getAttributeNames());
			attributesAfter.removeAll(attributesBefore);
			for (String attrName : attributesAfter) {
				Object value = request.getAttribute(attrName);
				if (value instanceof Serializable) {
					cacheableRequestAttributes.put(attrName, (Serializable)value);
				}
			}
		}
		finally {
			if (isInclude) {
				WrappedResponseHolder.setWrappedResponse(originalResponse);
			}
		}
		wrapper.flush();

		long timeToLiveSeconds = Integer.MAX_VALUE; // TODO cacheManager.getEhcache(context.cacheName).cacheConfiguration.timeToLiveSeconds;

		String contentType = wrapper.getContentType();
		if (!StringUtils.hasLength(contentType)) {
			contentType = response.getContentType();
		}

		return new PageInfo(wrapper.getStatus(), contentType, out.toByteArray(),
			false, timeToLiveSeconds, wrapper.getAllHeaders(), wrapper.getCookies(), cacheableRequestAttributes);
	}

	protected List<String> toList(Enumeration<String> e) {
		List<String> list = new ArrayList<String>();
		while (e.hasMoreElements()) {
			list.add(e.nextElement());
		}
		return list;
	}

	protected String calculateKey(HttpServletRequest request) {
		return keyGenerator.generate(request);
	}

	/**
	 * Writes the response from a PageInfo object.
	 * <p/>
	 * Headers are set last so that there is an opportunity to override
	 *
	 * 1 - only set status, contentType, cookies, etc. if this is the "main"
	 * request and not an include. 2 - send a status code 304 if appropriate.
	 *
	 * @param request
	 * @param response
	 * @param pageInfo
	 * @throws IOException
	 */
	protected void writeResponse(final HttpServletRequest request, final HttpServletResponse response,
			final PageInfo pageInfo) throws IOException {

		if (!WebUtils.isIncludeRequest(request)) {
			int statusCode = determineResponseStatus(request, pageInfo);
			response.setStatus(statusCode);
			setContentType(response, pageInfo);
			setCookies(pageInfo, response);
			setHeaders(pageInfo, response);
		}
		writeResponse(response, pageInfo);
	}

	protected int determineResponseStatus(HttpServletRequest request, PageInfo pageInfo) {
		int statusCode = pageInfo.getStatusCode();
		if (!pageInfo.isModified(request)) {
			log.debug("Content not modified since {} sending 304", request.getHeader(HttpHeaders.IF_MODIFIED_SINCE));
			statusCode = HttpServletResponse.SC_NOT_MODIFIED;
		}
		else if (pageInfo.isMatch(request)) {
			log.debug("Content matches entity tag {} sending 304", request.getHeader(HttpHeaders.IF_NONE_MATCH));
			statusCode = HttpServletResponse.SC_NOT_MODIFIED;
		}
		return statusCode;
	}

	protected void setContentType(final HttpServletResponse response, final PageInfo pageInfo) {
		String contentType = pageInfo.getContentType();
		if (contentType != null && contentType.length() > 0) {
			response.setContentType(contentType);
		}
	}

	protected void setCookies(final PageInfo pageInfo, final HttpServletResponse response) {
		Collection<SerializableCookie> cookies = pageInfo.getSerializableCookies();
		for (SerializableCookie cookie : cookies) {
			response.addCookie(cookie.toCookie());
		}
	}

	/**
	 * Set the headers in the response object, excluding the Gzip header
	 * @param pageInfo
	 * @param response
	 */
	protected void setHeaders(final PageInfo pageInfo, final HttpServletResponse response) {

		Collection<Header<? extends Serializable>> headers = pageInfo.getHeaders();

		// Track which headers have been set so all headers of the same name
		// after the first are added
		TreeSet<String> setHeaders = new TreeSet<String>(String.CASE_INSENSITIVE_ORDER);

		for (Header<? extends Serializable> header : headers) {
			String name = header.getName();

			switch (header.getType()) {
				case STRING:
					if (setHeaders.contains(name)) {
						response.addHeader(name, (String) header.getValue());
					}
					else {
						setHeaders.add(name);
						response.setHeader(name, (String) header.getValue());
					}
					break;
				case DATE:
					if (setHeaders.contains(name)) {
						response.addDateHeader(name, (Long) header.getValue());
					}
					else {
						setHeaders.add(name);
						response.setDateHeader(name, (Long) header.getValue());
					}
					break;
				case INT:
					if (setHeaders.contains(name)) {
						response.addIntHeader(name, (Integer) header.getValue());
					}
					else {
						setHeaders.add(name);
						response.setIntHeader(name, (Integer) header.getValue());
					}
					break;
				default:
					throw new IllegalArgumentException("No mapping for Header: " + header);
			}
		}
	}

	protected void initContext() {
		GrailsWebRequest requestAttributes = (GrailsWebRequest)RequestContextHolder.getRequestAttributes();
		contextHolder.get().push(new ContentCacheParameters(requestAttributes));
	}

	protected ContentCacheParameters getContext() {
		return contextHolder.get().peek();
	}

	protected void destroyContext() {
		contextHolder.get().pop();
		if (contextHolder.get().empty()) {
			contextHolder.remove();
		}
	}

	protected String getCachedUri(HttpServletRequest request) {
		if (WebUtils.isIncludeRequest(request)) {
			return (String)request.getAttribute(WebUtils.INCLUDE_REQUEST_URI_ATTRIBUTE);
		}
		return request.getRequestURI();
	}

	protected void logRequestDetails(HttpServletRequest request, ContentCacheParameters cacheParameters, String message) {
		if (!log.isDebugEnabled()) {
			return;
		}

		log.debug("{}...", message);
		log.debug("    method = {}", request.getMethod());
		log.debug("    requestURI = {}", request.getRequestURI());
		log.debug("    forwardURI = {}", WebUtils.getForwardURI(request));
		if (WebUtils.isIncludeRequest(request)) {
			log.debug("    includeURI = {}", request.getAttribute(WebUtils.INCLUDE_REQUEST_URI_ATTRIBUTE));
		}
		log.debug("    controller = {}", cacheParameters.getControllerName());
		log.debug("    action = {}", cacheParameters.getActionName());
		RequestMimeTypesApi requestMimeTypesApi = getBean("requestMimeTypesApi");
		log.debug("    format = {}", requestMimeTypesApi.getFormat(request));
		log.debug("    params = {}", cacheParameters.getParams());
	}

	protected Map<String, Collection<CacheOperationContext>> createOperationContext(
			Collection<CacheOperation> cacheOperations, Method method,
			Class<?> targetClass, HttpServletRequest request) {

		Map<String, Collection<CacheOperationContext>> map = new LinkedHashMap<String, Collection<CacheOperationContext>>(3);

		Collection<CacheOperationContext> cacheables = new ArrayList<CacheOperationContext>();
		Collection<CacheOperationContext> evicts = new ArrayList<CacheOperationContext>();
		Collection<CacheOperationContext> updates = new ArrayList<CacheOperationContext>();

		Object[] args = findArgs(request, method);

		for (CacheOperation cacheOperation : cacheOperations) {
			CacheOperationContext opContext = new CacheOperationContext(
					cacheOperation, method, args, targetClass, getCaches(cacheOperation),
					expressionEvaluator, keyGenerator, request);

			if (cacheOperation instanceof CacheableOperation) {
				cacheables.add(opContext);
			}

			if (cacheOperation instanceof CacheEvictOperation) {
				evicts.add(opContext);
			}

			if (cacheOperation instanceof CachePutOperation) {
				updates.add(opContext);
			}
		}

		map.put(CACHEABLE, cacheables);
		map.put(EVICT, evicts);
		map.put(UPDATE, updates);

		return map;
	}

	protected Object[] findArgs(HttpServletRequest request, Method method) {
		String[] names = paramNameDiscoverer.getParameterNames(method);
		if (names == null) {
			log.warn("Unable to lookup parameter names for method " + method);
			return null;
		}

		List<Object> args = new ArrayList<Object>();
		Class<?>[] types = method.getParameterTypes();
		for (int i = 0, count = types.length; i < count; i++) {
			args.add(findArg(request, types[i], names[i]));
		}
		return args.toArray();
	}

	protected Object findArg(HttpServletRequest request, Class<?> type, String name) {

		if (String.class.equals(type)) {
			return request.getParameter(name);
		}

		if (PRIMITIVE_CLASSES.contains(type) || TYPE_TO_CONVERSION_METHOD_NAME.containsKey(type)) {

			String conversionMethodName;
			if (TYPE_TO_CONVERSION_METHOD_NAME.containsKey(type)) {
				conversionMethodName = TYPE_TO_CONVERSION_METHOD_NAME.get(type);
			}
			else {
				conversionMethodName = type.getName();
			}

			GrailsWebRequest grailsRequest = (GrailsWebRequest)RequestContextHolder.getRequestAttributes();
			GrailsParameterMap params = grailsRequest.getParams();

			return getParamValue(params, conversionMethodName, name);
		}

		log.warn("Unsupported parameter type " + type + " for parameter " + name);
		return null;
	}

	protected Object getParamValue(GrailsParameterMap params, String conversionMethodName, String paramName) {
		Method method = PARAMS_METHODS.get(conversionMethodName);
		if (method == null) {
			log.warn("No method found for " + conversionMethodName + " in GrailsParameterMap");
			return null;
		}

		return ReflectionUtils.invokeMethod(method, params, paramName);
	}

	protected Collection<Cache> getCaches(CacheOperation operation) {
		Set<String> cacheNames = operation.getCacheNames();
		Collection<Cache> caches = new ArrayList<Cache>(cacheNames.size());
		for (String name : cacheNames) {
			Cache cache = getCacheManager().getCache(name);
			if (cache == null) {
				throw new IllegalArgumentException("Cannot find cache named [" + name + "] for " + operation);
			}
			caches.add(cache);
		}
		return caches;
	}

	protected boolean inspectBeforeCacheEvicts(Collection<CacheOperationContext> evictions) {
		return inspectCacheEvicts(evictions, true);
	}

	protected boolean inspectAfterCacheEvicts(Collection<CacheOperationContext> evictions) {
		return inspectCacheEvicts(evictions, false);
	}

	protected boolean inspectCacheEvicts(Collection<CacheOperationContext> evictions, boolean beforeInvocation) {
		if (evictions.isEmpty()) {
			return false;
		}

		boolean trace = log.isTraceEnabled();

		boolean atLeastOne = false;
		for (CacheOperationContext operationContext : evictions) {
			CacheEvictOperation evict = (CacheEvictOperation) operationContext.operation;

			if (beforeInvocation == evict.isBeforeInvocation()) {
				if (operationContext.isConditionPassing()) {
					atLeastOne = true;
					// for each cache
					// lazy key initialization
					Object key = null;

					for (Cache cache : operationContext.getCaches()) {
						// cache-wide flush
						if (evict.isCacheWide()) {
							cache.clear();
							logRequestDetails(operationContext.request, getContext(), "Flushing request");
						}
						else {
							// check key
							if (key == null) {
								key = operationContext.generateKey();
							}
							if (trace) {
								log.trace("Invalidating cache key {} for operation {} on method {}",
										new Object[] { key, evict, operationContext.method });
							}
							cache.evict(key);
						}
					}
				}
				else {
					logRequestDetails(operationContext.request, getContext(), "Not flushing request");
				}
			}
		}
		return atLeastOne;
	}

	protected CacheStatus inspectCacheables(Collection<CacheOperationContext> cacheables) {

		if (cacheables.isEmpty()) {
			return null;
		}

		Map<CacheOperationContext, Object> cUpdates = new LinkedHashMap<CacheOperationContext, Object>(cacheables.size());

		boolean trace = log.isTraceEnabled();
		boolean updateRequired = false;
		boolean atLeastOne = false;

		ValueWrapper valueWrapper = null;

		for (CacheOperationContext context : cacheables) {
			if (context.isConditionPassing()) {
				atLeastOne = true;
				Object key = context.generateKey();

				if (trace) {
					log.trace("Computed cache key {} for operation {}", new Object[] { key, context.operation });
				}
				if (key == null) {
					throw new IllegalArgumentException(
							"Null key returned for cache operation (maybe you are using named params on classes without debug info?) " +
							context.operation);
				}

				// add op/key (in case an update is discovered later on)
				cUpdates.put(context, key);

				boolean localCacheHit = false;

				// check whether the cache needs to be inspected or not (the method will be invoked anyway)
				if (!updateRequired) {
					for (Cache cache : context.getCaches()) {
						ValueWrapper wrapper = cache.get(key);
						if (wrapper != null) {
							valueWrapper = wrapper;
							localCacheHit = true;
							break;
						}
					}
				}

				if (!localCacheHit) {
					updateRequired = true;
				}
			}
			else {
				if (trace) {
					log.trace("Cache condition failed on method {} for operation {}", new Object[] { context.method, context.operation });
				}
			}
		}

		// return a status only if at least one cacheable matched
		if (atLeastOne) {
			return new CacheStatus(cUpdates, updateRequired, valueWrapper);
		}

		return null;
	}

	protected Map<CacheOperationContext, Object> inspectCacheUpdates(Collection<CacheOperationContext> updates) {

		Map<CacheOperationContext, Object> cUpdates = new LinkedHashMap<CacheOperationContext, Object>(updates.size());
		if (updates.isEmpty()) {
			return cUpdates;
		}

		boolean trace = log.isTraceEnabled();

		for (CacheOperationContext context : updates) {
			if (context.isConditionPassing()) {

				Object key = context.generateKey();

				if (trace) {
					log.trace("Computed cache key {} for operation {}",
							new Object[] { key, context.operation });
				}
				if (key == null) {
					throw new IllegalArgumentException(
							"Null key returned for cache operation (maybe you are using named params on classes without debug info?) " +
									context.operation);
				}

				// add op/key (in case an update is discovered later on)
				cUpdates.put(context, key);
			}
			else {
				if (trace) {
					log.trace("Cache condition failed on method {} for operation {}",
							new Object[] { context.method, context.operation} );
				}
			}
		}

		return cUpdates;
	}

	/**
	 * Assembles a response from a cached page include. These responses are never
	 * gzipped The content length should not be set in the response, because it
	 * is a fragment of a page. Don't write any headers at all.
	 */
	protected void writeResponse(final HttpServletResponse response, final PageInfo pageInfo) throws IOException {
		byte[] cachedPage = pageInfo.getUngzippedBody();
		String page = new String(cachedPage, response.getCharacterEncoding());

		String implementationVendor = response.getClass().getPackage().getImplementationVendor();
		if (implementationVendor != null && implementationVendor.equals("\"Evermind\"")) {
			response.getOutputStream().print(page);
		}
		else {
			response.getWriter().write(page);
		}
	}

	protected void update(Collection<Cache> caches, PageInfo pageInfo, CacheStatus cacheStatus, String key) {
		ValueWrapper element = cacheStatus == null ? null : cacheStatus.valueWrapper;
		Object maxAge = pageInfo.getCacheDirectives().get("max-age");
		int timeToLive = (maxAge instanceof Integer) ? ((Integer)maxAge) : (int)pageInfo.getTimeToLiveSeconds();
		for (Cache cache : caches) {
			log.debug("Response ok. Adding to cache {} with key {} and ttl {}",
					new Object[] { cache.getName(), key, getTimeToLive(element) });
			put(cache, key, pageInfo, timeToLive);
		}
	}

	protected Object lookupController(Class<?> controllerClass) {
		if (controllerClass == null) {
			return null;
		}
		return getBean(controllerClass.getName());
	}

	/**
	 * Dependency injection for GrailsAnnotationCacheOperationSource.
	 * @param source
	 */
	public void setCacheOperationSource(GrailsAnnotationCacheOperationSource source) {
		cacheOperationSource = source;
	}

	/**
	 * Dependency injection for ExpressionEvaluator.
	 * @param source
	 */
	public void setExpressionEvaluator(ExpressionEvaluator evaluator) {
		expressionEvaluator = evaluator;
	}

	/**
	 * Dependency injection for WebKeyGenerator.
	 * @param source
	 */
	public void setKeyGenerator(WebKeyGenerator generator) {
		keyGenerator = generator;
	}

	@Override
	public void afterPropertiesSet() throws ServletException {
		super.afterPropertiesSet();
		Assert.notNull(cacheOperationSource, "cacheOperationSource is required");
		Assert.notNull(expressionEvaluator, "expressionEvaluator is required");
		Assert.notNull(keyGenerator, "keyGenerator is required");
	}

	public static class CacheStatus {
		// caches/key
		protected final Map<CacheOperationContext, Object> updates;
		protected final boolean updateRequired;
		protected final ValueWrapper valueWrapper;

		protected CacheStatus(Map<CacheOperationContext, Object> updates, boolean updateRequired, ValueWrapper valueWrapper) {
			this.updates = updates;
			this.updateRequired = updateRequired;
			this.valueWrapper = valueWrapper;
		}
	}
}
