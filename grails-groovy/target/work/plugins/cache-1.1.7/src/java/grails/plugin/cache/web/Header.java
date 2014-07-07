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
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.util.Assert;

/**
 * Generic implementation of a HTTP header. Handles String, Int and Date typed headers.
 *
 * Based on net.sf.ehcache.constructs.web.Header.
 *
 * @author Eric Dalquist
 * @author Burt Beckwith
 */
public class Header<T extends Serializable> implements Serializable {

	private static final long serialVersionUID = 1;

	protected final String name;
	protected final T value;
	protected final Type type;

	/**
	 * Used to help differentiate the different header types
	 */
	public enum Type {
		/**
		 * A String Header.
		 * {@link javax.servlet.http.HttpServletResponse#setHeader(String, String)}
		 */
		STRING(String.class),

		/**
		 * A date Header.
		 * {@link javax.servlet.http.HttpServletResponse#setDateHeader(String, long)}
		 */
		DATE(Long.class),

		/**
		 * A int Header.
		 * {@link javax.servlet.http.HttpServletResponse#setIntHeader(String, int)}
		 */
		INT(Integer.class);

		private static final Map<Class<? extends Serializable>, Type> TYPE_LOOKUP = new ConcurrentHashMap<Class<? extends Serializable>, Type>();
		private final Class<? extends Serializable> type;

		private Type(Class<? extends Serializable> type) {
			this.type = type;
		}

		/**
		 * @return The header type class this Type represents
		 */
		public Class<? extends Serializable> getTypeClass() {
			return type;
		}

		/**
		 * Determines the {@link Type} of the Header. Throws
		 * IllegalArgumentException if the specified class does not match any of
		 * the Types
		 */
		public static Type determineType(Class<? extends Serializable> typeClass) {
			Type lookupType = TYPE_LOOKUP.get(typeClass);
			if (lookupType != null) {
				return lookupType;
			}

			for (Type t : Type.values()) {
				if (typeClass == t.getTypeClass()) {
					// If the class explicitly matches add to the lookup cache
					TYPE_LOOKUP.put(typeClass, t);
					return t;
				}

				if (typeClass.isAssignableFrom(t.getTypeClass())) {
					return t;
				}
			}

			throw new IllegalArgumentException("No Type for class " + typeClass);
		}
	}

	/**
	 * Create a new Header
	 *
	 * @param name Name of the header, may not be null
	 * @param value Value of the header, may not be null
	 */
	public Header(String name, T value) {
		Assert.notNull(name, "Header cannnot have a null name");
		Assert.notNull(value, "Header cannnot have a null value");
		this.name = name;
		this.value = value;
		type = Type.determineType(value.getClass());
	}

	/**
	 * @return Name of the header, will never be null
	 */
	public String getName() {
		return name;
	}

	/**
	 * @return Value for the header, will never be null
	 */
	public T getValue() {
		return value;
	}

	/**
	 * @return The header type
	 */
	public Type getType() {
		return type;
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	@Override
	public int hashCode() {
		int prime = 31;
		int result = 1;
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + ((type == null) ? 0 : type.hashCode());
		result = prime * result + ((value == null) ? 0 : value.hashCode());
		return result;
	}

	/**
	 * @see java.lang.Object#equals(java.lang.Object)
	 */
	@Override
	public boolean equals(Object obj) {
		if (this == obj) {
			return true;
		}
		if (obj == null) {
			return false;
		}
		if (getClass() != obj.getClass()) {
			return false;
		}
		Header<?> other = (Header<?>)obj;
		if (name == null) {
			if (other.name != null) {
				return false;
			}
		}
		else if (!name.equals(other.name)) {
			return false;
		}
		if (type == null) {
			if (other.type != null) {
				return false;
			}
		}
		else if (!type.equals(other.type)) {
			return false;
		}
		if (value == null) {
			if (other.value != null) {
				return false;
			}
		}
		else if (!value.equals(other.value)) {
			return false;
		}
		return true;
	}

	@Override
	public String toString() {
		return "Header<" + type.getTypeClass().getSimpleName() + "> [name=" + name + ", value=" + value + "]";
	}
}
