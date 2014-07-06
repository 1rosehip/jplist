package com.jplist;
import groovy.json.JsonSlurper;

class HandlerController {
	
	def index = { 
		
		def statuses = params.statuses
		def slurper = new JsonSlurper()
		
		if(statuses){
			statuses = java.net.URLDecoder.decode(statuses)
			statuses = slurper.parseText(statuses)
			
			statuses.eachWithIndex {obj, i ->
				render "${i}: ${obj}"
			}
			
			//render statuses
		}
		
		
		render ""
	}
}
