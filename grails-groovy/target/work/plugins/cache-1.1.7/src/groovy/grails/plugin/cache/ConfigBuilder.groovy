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
package grails.plugin.cache

import grails.util.Environment

import org.slf4j.Logger
import org.slf4j.LoggerFactory

/**
 * @author Jeff Brown
 * @author Burt Beckwith
 */
class ConfigBuilder extends BuilderSupport {

	protected static final List CACHE_PARAM_NAMES = ['env', 'name']

	List<String> cacheNames = []

	protected Map<String, Object> _current
	protected List<String> _stack = []
	protected List<Map<String, Object>> _caches = []
	protected int _unrecognizedElementDepth = 0
	protected final Logger _log = LoggerFactory.getLogger(getClass())

	/**
	 * Convenience method to parse a config closure.
	 * @param c the closure
	 */
	void parse(Closure c) {
		c.delegate = this
		c.resolveStrategy = Closure.DELEGATE_FIRST
		c()

		resolveCaches()
	}

	void parse(o) {
		// if there's no explicit method, the missing method logic kicks in and fails poorly
		throw new IllegalArgumentException('parse must be called with a Closure argument')
	}

	@Override
	protected createNode(name) {
		if (_unrecognizedElementDepth) {
			_unrecognizedElementDepth++
			_log.warn "ignoring node $name contained in unrecognized parent node"
			return
		}

		_log.trace "createNode $name"

		switch (name) {
			case 'cache':
			case 'domain':
				_current = [:]
				_caches << _current
				_stack.push name
				return name
		}

		_unrecognizedElementDepth++
		_log.warn "Cannot create empty node with name '$name'"
	}

	@Override
	protected createNode(name, value) {
		if (_unrecognizedElementDepth) {
			_unrecognizedElementDepth++
			_log.warn "ignoring node $name with value $value contained in unrecognized parent node"
			return
		}

		_log.trace "createNode $name, value: $value"

		String level = _stack[-1]
		_stack.push name

		switch (level) {
			case 'domain':
			case 'cache':
				if (('name' == name || 'cache' == name || 'domain' == name) && value instanceof Class) {
					value = value.name
				}

				if ('name' == name || 'cache' == name  || 'domain' == name || name in CACHE_PARAM_NAMES) {
					_current[name] = value
					return name
				}

				break
		}

		_unrecognizedElementDepth++
		_log.warn "Cannot create node with name '$name' and value '$value' for parent '$level'"
	}

	@Override
	protected createNode(name, Map attributes) {
		if (_unrecognizedElementDepth) {
			_unrecognizedElementDepth++
			_log.warn "ignoring node $name with attributes $attributes contained in unrecognized parent node"
			return
		}

		_log.trace "createNode $name + attributes: $attributes"
	}

	@Override
	protected createNode(name, Map attributes, value) {
		if (_unrecognizedElementDepth) {
			_unrecognizedElementDepth++
			_log.warn "ignoring node $name with value $value and attributes $attributes contained in unrecognized parent node"
			return
		}

		_log.trace "createNode $name + value: $value attributes: $attributes"
	}

	@Override
	protected void setParent(parent, child) {
		_log.trace "setParent $parent, child: $child"
		// do nothing
	}

	@Override
	protected void nodeCompleted(parent, node) {
		_log.trace "nodeCompleted $parent $node"

		if (_unrecognizedElementDepth) {
			_unrecognizedElementDepth--
		}
		else {
			_stack.pop()
		}
	}

	protected boolean isValidInEnv(Map data, String env) {
		def environments = data.remove('env') ?: []
		if (!(environments instanceof List)) {
			environments = [environments]
		}

		environments.isEmpty() || environments.contains(env)
	}

	protected void resolveCaches() {
		String env = Environment.current.name

		for (data in _caches) {
			if (!isValidInEnv(data, env)) {
				_log.debug "skipping cache $data.name since it's not valid in env '$env'"
				continue
			}
			String name = data.name
			if (!name) {
				_log.warn 'ignoring cache specified with no name'
				continue
			}
			cacheNames << name
		}
	}
}
