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
package grails.plugin.databasemigration.dbdoc

/**
 * @author <a href='mailto:burt@burtbeckwith.com'>Burt Beckwith</a>
 */
class HTMLListWriter {

	protected String directory
	protected String filename
	protected String title
	protected Map files

	HTMLListWriter(String title, String filename, String subdir, Map files) {
		this.title = title
		this.filename = filename
		this.directory = subdir
		this.files = files
	}

	void writeHTML(SortedSet objects) {
		StringBuilder content = new StringBuilder()
		content.append """\
<html>
<head>
<title>
$title
</title>
<link rel="stylesheet" type="text/css" href="dbdoc_stylesheet_css" title="Style"/>
</head>
<body bgcolor="white">
<font size="+1" class="FrameHeadingFont">
<b>$title</b></font>
<br/>
<table border="0" width="100%" summary=""><tr>
<td nowrap><font class="FrameItemFont">
"""

		for (object in objects) {
			String s = object.toString()
			String hrefName = s.toLowerCase().endsWith('.xml') ? s[0..-5] : s
			content.append """<a href="$directory/${hrefName.toLowerCase()}" target="objectFrame">"""
			content.append s
			content.append "</a><br/>\n"
		}

		content.append '''\
</font></td>
</tr>
</table>

</body>
</html>'''

		files[filename] = content.toString()
	}
}
