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

import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;

/**
 * A Serializable version of java.io.ByteArrayOutputStream.
 *
 * @author Burt Beckwith
 */
public class SerializableByteArrayOutputStream extends SerializableOutputStream {

	private static final long serialVersionUID = 1;

	protected byte[] buf;
	protected int count;

	public SerializableByteArrayOutputStream() {
		this(32);
	}

	public SerializableByteArrayOutputStream(int size) {
		if (size < 0) {
			throw new IllegalArgumentException("Negative initial size: " + size);
		}
		buf = new byte[size];
	}

	@Override
	public synchronized void write(int b) {
		int newcount = count + 1;
		if (newcount > buf.length) {
			buf = copyOf(Math.max(buf.length << 1, newcount));
		}
		buf[count] = (byte)b;
		count = newcount;
	}

	@Override
	public synchronized void write(byte[] b, int off, int len) {
		if ((off < 0) || (off > b.length) || (len < 0) ||
				((off + len) > b.length) || ((off + len) < 0)) {
			throw new IndexOutOfBoundsException();
		}

		if (len == 0) {
			return;
		}

		int newcount = count + len;
		if (newcount > buf.length) {
			buf = copyOf(Math.max(buf.length << 1, newcount));
		}
		System.arraycopy(b, off, buf, count, len);
		count = newcount;
	}

	public synchronized void writeTo(OutputStream out) throws IOException {
		out.write(buf, 0, count);
	}

	public synchronized void reset() {
		count = 0;
	}

	public synchronized byte[] toByteArray() {
		return copyOf(count);
	}

	// ByteArrayOutputStream uses Arrays.copyOf which is only in Java 6, that's inlined here.
	protected byte[] copyOf(int newLength) {
      byte[] copy = new byte[newLength];
      System.arraycopy(buf, 0, copy, 0, Math.min(buf.length, newLength));
      return copy;
	}

	public synchronized int size() {
		return count;
	}

	@Override
	public synchronized String toString() {
		return new String(buf, 0, count);
	}

	public synchronized String toString(String charsetName) throws UnsupportedEncodingException {
		return new String(buf, 0, count, charsetName);
	}

	@Override
	public void close() throws IOException {
		// no-op
	}
}
