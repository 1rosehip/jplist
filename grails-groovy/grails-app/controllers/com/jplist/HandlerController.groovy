package com.jplist;
import groovy.json.JsonSlurper;
import grails.converters.JSON;

public class HandlerController {
			
	def doAction(instance, action, args1, args2){
		instance."$action"(args1, args2)
	}		
	
	def index = { 
		
		def statuses = params.statuses
		def slurper = new JsonSlurper()
		
		if(statuses){
			statuses = java.net.URLDecoder.decode(statuses)
			statuses = slurper.parseText(statuses)
			
			def options = [:]
			def optionsWithoutPager = [:]
			def filter = ""
			def filterValue = "";
			
			statuses.eachWithIndex {obj, i ->
			
				//render "${i}: ${obj}"
				
				switch(obj['action']){
					case 'paging':
						if(obj['data']){
						
							def currentPage = obj['data']['currentPage'].toInteger()
							def number = obj['data']['number'].toInteger()
							
							options['offset'] = currentPage * number
							options['max'] = number
						}
					break
					
					case 'filter':
						if(obj['data']){
													
							if(obj['data']['value']){								
								filter = 'Title'
								filterValue = obj['data']['value']
							}
							
						}
					break
					
					case 'sort':
						if(obj['data']){
							switch(obj['data']['path']){
							
								case '.title':
								options['sort'] = 'title'
								options['order'] = obj['data']['order']
								
								optionsWithoutPager['sort'] = 'title'
								optionsWithoutPager['order'] = obj['data']['order']
								break
								
								case '.desc':
								options['sort'] = 'description'
								options['order'] = obj['data']['order']
								
								optionsWithoutPager['sort'] = 'description'
								optionsWithoutPager['order'] = obj['data']['order']
								break
								
								case '.like':
								options['sort'] = 'likes'
								options['order'] = obj['data']['order']
								
								optionsWithoutPager['sort'] = 'likes'
								optionsWithoutPager['order'] = obj['data']['order']
								break
							}
						}
					break
				}
			}
			
			def resultsList = [:]
			def resultsListWithoutPager = [:]
			
			if(filter){
				
				resultsList = doAction(Item, "findAllBy" + filter + "Like", "%" + filterValue + "%", options) 
				resultsListWithoutPager = doAction(Item, "findAllBy" + filter + "Like", "%" + filterValue + "%", optionsWithoutPager) 
			}
			else{
				resultsList = Item.list(options)
				resultsListWithoutPager = Item.list(optionsWithoutPager)
			}
						
			def count = resultsListWithoutPager.size()
			def json = ""
			
			json += "{"
			json += "\"count\":" + count
			json += ",\"data\":" + new JSON(resultsList).toString()
			json += "}"
		
			render json
		}
		
		render ""
	}
}
