package com.jplist;
import groovy.json.JsonSlurper;
import groovy.sql.Sql

class HandlerController {
	
	def index = { 
						
		def statuses = params.statuses
		def slurper = new JsonSlurper()
		
		if(statuses){
			statuses = java.net.URLDecoder.decode(statuses)
			statuses = slurper.parseText(statuses)
			
			statuses.eachWithIndex {obj, i ->
				//render "${i}: ${obj}"
			}
			
			//test...
			//def sql = Sql.newInstance("jdbc:mysql://localhost:3306/jplist_grails", "root", "root", "com.mysql.jdbc.Driver")
			
			//def itemsDataSet = sql.dataSet('Item')
			
			//def dataSource // the Spring-Bean "dataSource" is auto-injected
			//def db = new Sql(dataSource) // Create a new instance of groovy.sql.Sql with the DB of the Grails app
			
		}
		
		render ""
	}
}
