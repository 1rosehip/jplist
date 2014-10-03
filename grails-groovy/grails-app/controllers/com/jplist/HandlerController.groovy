package com.jplist

import grails.converters.JSON
import groovy.json.JsonSlurper

class HandlerController {

	def index(String statuses) {

		if (!statuses) {
			render ""
			return
		}

		def slurper = new JsonSlurper()

		def options = [:]
		String filter
		String filterValue

		for (obj in slurper.parseText(URLDecoder.decode(statuses, 'UTF-8'))) {

			if (!obj.data) {
				return
			}

			switch (obj.action) {
				case 'paging':
					if (obj.data.number != 'all') {
						Integer currentPage = obj.data.currentPage as Integer
						Integer number = obj.data.number as Integer

						options.offset = currentPage * number
						options.max = number
					}
					break

				case 'filter':
					if (obj.data.value) {
						filter = 'Title'
						filterValue = obj.data.value
					}
					break

				case 'sort':
					switch (obj.data.path) {

						case '.title':
							options.sort = 'title'
							options.order = obj.data.order
							break

						case '.desc':
							options.sort = 'description'
							options.order = obj.data.order
							break

						case '.like':
							options.sort = 'likes'
							options.order = obj.data.order
							break
					}
				break
			}
		}

		def results
		int count

		if (filter) {
			String by = filter + 'Like'
			String withWildcards = "%" + filterValue + "%"
			results = Item."findAllBy$by"(withWildcards, options)
			count = Item."countBy$by"(withWildcards)
		}
		else {
			results = Item.list(options)
			count = Item.count()
		}

		render([count: count, data: results] as JSON)
	}
}
