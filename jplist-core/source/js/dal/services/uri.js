(function(){
	'use strict';		
	
	/** 
	* URI Service
	* @type {Object}
	*/
	jQuery.fn.jplist.dal.services.URIService = {};
	
	/**
	* get data via ajax from the given url
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
	* @param {Object} options
	* @param {Function} okCallback
	* @param {Function} errorCallback
	* @param {Function} alwaysCallback
	*/
	jQuery.fn.jplist.dal.services.URIService.get = function(statuses, options, okCallback, errorCallback, alwaysCallback){
		
		var serverOptions = options.dataSource.server;
		
		if(!serverOptions.ajax.data){
			serverOptions.ajax.data = {};
		}
		
		//add statuses to the data array
		serverOptions.ajax.data.statuses = encodeURIComponent(JSON.stringify(statuses, function(key, value){
			
			/**
			* remove dom elements from statuses - it fails in chrome
			*/
			if(value && value.nodeType){
				return null;
			}
			
			return value;
		}));
					
		//send ajax request to the server
		jQuery.ajax(serverOptions.ajax).done(function(serverData, ajax, response){
			
			//server ok callback
			if(jQuery.isFunction(okCallback)){
				okCallback(serverData, statuses, ajax, response);
			}
			
			//server ok callback
			if(jQuery.isFunction(serverOptions.serverOkCallback)){
				serverOptions.serverOkCallback(serverData, statuses, ajax, response);
			}
		})
		.fail(function(){
		
			//server error callback
			if(jQuery.isFunction(errorCallback)){
				errorCallback(statuses);
			}
			
			//server error callback
			if(jQuery.isFunction(serverOptions.serverErrorCallback)){
				serverOptions.serverErrorCallback(statuses);
			}
		})
		.always(function(){
			
			//server always callback
			if(jQuery.isFunction(alwaysCallback)){
				alwaysCallback(statuses);
			}
		});
	};
	
	
})();

