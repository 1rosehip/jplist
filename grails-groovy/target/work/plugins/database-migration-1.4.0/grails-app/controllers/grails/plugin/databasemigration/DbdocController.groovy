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

import grails.plugin.databasemigration.dbdoc.MemoryDocVisitor
import grails.util.Environment
import liquibase.changelog.ChangeLogIterator
import liquibase.changelog.ChangeLogParameters
import liquibase.changelog.DatabaseChangeLog
import liquibase.changelog.filter.DbmsChangeSetFilter
import liquibase.database.Database
import liquibase.lockservice.LockService
import liquibase.parser.ChangeLogParserFactory

/**
 * @author <a href='mailto:burt@burtbeckwith.com'>Burt Beckwith</a>
 */
class DbdocController {

	def migrationResourceAccessor

	def index = {

		// only configure if explicitly enabled or in dev mode if not disabled
		def enabled = grailsApplication.config.grails.plugin.databasemigration.dbDocController.enabled
		if (!(enabled instanceof Boolean)) {
			enabled = Environment.current == Environment.DEVELOPMENT
		}
		if (!enabled) {
			response.sendError 404
			return
		}

		String changelogFileName = params.changelogFileName ?: MigrationUtils.changelogFileName
		if (!new File(MigrationUtils.changelogLocation, changelogFileName).exists()) {
			render "Changelog $changelogFileName not found"
			return
		}

		String section = params.section
		String filename = params.filename
		String table = params.table
		String column = params.column

		if (!filename && (section == 'index' || !section)) {
			render template: 'index', plugin: 'databaseMigration'
			return
		}

		if (section == 'globalnav') {
			render template: 'globalnav', plugin: 'databaseMigration'
			return
		}
		if (section == 'overview-summary') {
			render template: 'overview-summary', plugin: 'databaseMigration'
			return
		}
		if (section == 'dbdoc_stylesheet_css' ||
				filename == 'dbdoc_stylesheet_css' ||
				column == 'dbdoc_stylesheet_css') {
			render template: 'stylesheet', contentType: 'text/css', plugin: 'databaseMigration'
			return
		}

		String sessionKey = '__DBDOC__' + changelogFileName
		def files = session[sessionKey]
		if (!files) {
			files = generateHTML(changelogFileName)
			session[sessionKey] = files
		}

		if (!filename) {
			if (files.containsKey(section)) {
				render files[section]
				return
			}
			render "no content for $section"
			return
		}

		if (section == 'changelogs' && !filename.toLowerCase().endsWith('.groovy')) {
			filename += '.xml'
		}

		String key = table && column ? "columns/${table}.${column}" : "$section/$filename"
		if (files.containsKey(key)) {
			if (key.endsWith('.xml')) {
				render text: files[key], contentType: 'text/xml'
			}
			else if (key.endsWith('.groovy')) {
				render text: '<pre>\n' + files[key] + '\n</pre>', contentType: 'text/html'
			}
			else {
				render files[key]
			}
			return
		}

		render "no content for $key"
	}

	protected Map generateHTML(String changelogFileName) {
		def database
		LockService lockService
		try {

			database = MigrationUtils.getDatabase()

			lockService = LockService.getInstance(database)
			lockService.waitForLock()

			DatabaseChangeLog changeLog = ChangeLogParserFactory.instance.getParser(
				changelogFileName, migrationResourceAccessor).parse(
				changelogFileName, new ChangeLogParameters(database), migrationResourceAccessor)

			checkDatabaseChangeLogTable changeLog, database

			changeLog.validate database

			ChangeLogIterator logIterator = new ChangeLogIterator(
				changeLog, new DbmsChangeSetFilter(database))

			MemoryDocVisitor visitor = new MemoryDocVisitor(database)
			logIterator.run visitor, database

			def files = visitor.generateHTML(migrationResourceAccessor)
			files.pending = files['pending/index']
			files.pendingsql = files['pending/sql']
			files.recent = files['recent/index']
			files
		}
		finally {
			try { lockService.releaseLock() } catch (ignored) {}
			try { database?.close() } catch (ignored) {}
		}
	}

	protected void checkDatabaseChangeLogTable(DatabaseChangeLog databaseChangeLog, Database database) {
		database.checkDatabaseChangeLogTable false, databaseChangeLog, null
		database.checkDatabaseChangeLogLockTable()
	}
}
