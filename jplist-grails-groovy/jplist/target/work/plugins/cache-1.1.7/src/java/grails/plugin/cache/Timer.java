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
package grails.plugin.cache;

import org.apache.commons.lang.time.StopWatch;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Based on grails.plugin.springcache.web.Timer.
 *
 * @author Rob Fletcher
 * @author Burt Beckwith
 */
public class Timer {

	protected final Logger log = LoggerFactory.getLogger(getClass());
	protected final String uri;
	protected final StopWatch stopWatch = new StopWatch();

	public Timer(String uri) {
		this.uri = uri;
	}

	public void start() {
		if (log.isInfoEnabled()) {
			stopWatch.start();
		}
	}

	public void stop(boolean cached) {
		if (log.isInfoEnabled()) {
			stopWatch.stop();
			log.info("{} request for {} took {}",
					new Object[] { cached ? "Cached" : "Uncached", uri, stopWatch });
		}
	}
}
