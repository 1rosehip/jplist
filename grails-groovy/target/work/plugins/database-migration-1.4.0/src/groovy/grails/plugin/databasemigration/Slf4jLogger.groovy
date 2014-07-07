/* Copyright 2010-2013 SpringSource.
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
package grails.plugin.databasemigration

import liquibase.logging.LogLevel

import org.slf4j.Logger
import org.slf4j.LoggerFactory

/**
 * Logger that uses Grails Slf4j loggers and configuration.
 *
 * @author <a href='mailto:burt@burtbeckwith.com'>Burt Beckwith</a>
 */
class Slf4jLogger implements liquibase.logging.Logger {

	protected Logger log

	void severe(String message) { log.error message }

	void severe(String message, Throwable e) { log.error message, e }

	void warning(String message) { log.warn message }

	void warning(String message, Throwable e) { log.warn message, e }

	void info(String message) { log.info message }

	void info(String message, Throwable e) { log.info message, e }

	void debug(String message) { log.debug message }

	void debug(String message, Throwable e) { log.debug message, e }

	int getPriority() { 10 }

	void setName(String name) {
		log = LoggerFactory.getLogger(name)
	}

	void setLogLevel(String logLevel, String logFile) {
		// only used from Liquibase commandline
		throw new UnsupportedOperationException()
	}

	void setLogLevel(String ignored) {
		// ignored, use standard log4j configuration
	}

	void setLogLevel(LogLevel ignored) {
		// ignored, use standard log4j configuration
	}

	LogLevel getLogLevel() {
		// only used from Liquibase commandline
		throw new UnsupportedOperationException()
	}
}
