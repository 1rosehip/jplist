(function(){
	'use strict';	
	
	/**
	* save statuses to storage according to user options
	* @param {Object} context
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
	*/
	var save = function(context, statuses){
		
		var statusesToSave = []
			,status;
		
		if(statuses && context.isStorageEnabled){
		
			for(var i=0; i<statuses.length; i++){
				
				status = statuses[i];
				
				if(status.inStorage){
					statusesToSave.push(status);
				}
			}
			
			if(context.options.storage === 'cookies'){
				
				//save statuses to the storage
				jQuery.fn.jplist.dal.services.CookiesService.saveCookies(statusesToSave, context.options.storageName, context.options.cookiesExpiration);
			}
			
			if((context.options.storage === 'localstorage') && jQuery.fn.jplist.dal.services.LocalStorageService.supported()){
				
				//save statuses to the storage
				jQuery.fn.jplist.dal.services.LocalStorageService.save(statusesToSave, context.options.storageName);
			}
		}
	};
	
	/**
	* constructor
	* @param {jQueryObject} $root - jplist jquery element
	* @param {Object} options - jplist user options
	* @param {Object} observer
	* @return {Object}	
	* @constructor 
	*/
	var Init = function($root, options, observer){
	
		var context = {
			options: options
			,observer: observer
			,$root: $root
			,isStorageEnabled: false
		};	
		
		context.isStorageEnabled = (context.options.storage === 'cookies') || ((context.options.storage === 'localstorage') && jQuery.fn.jplist.dal.services.LocalStorageService.supported());
				
		return jQuery.extend(this, context);
	};
		
	/**
	* save statuses to storage according to user options
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
	*/
	Init.prototype.save = function(statuses){
		save(this, statuses);
	};
	
	/**
	* Storage
	* @param {jQueryObject} $root - jplist jquery element
	* @param {Object} options - jplist user options
	* @param {Object} observer
	* @return {Object}
	* @constructor 
	*/
	jQuery.fn.jplist.dal.Storage = function($root, options, observer){
				
		//call constructor
		return new Init($root, options, observer);
	};
})();
	