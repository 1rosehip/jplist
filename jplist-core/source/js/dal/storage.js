/**
* cookies and local storage
*/
;(function(){
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
	* Storage
	* @param {jQueryObject} $root - jplist jquery element
	* @param {Object} options - jplist user options
	* @param {Object} observer
	* @return {Object}
	* @constructor 
	*/
	jQuery.fn.jplist.dal.Storage = function($root, options, observer){
				
		this.options = options;
		this.observer = observer;
		this.$root = $root;
		this.isStorageEnabled = false;	
		this.isStorageEnabled = 
			(this.options.storage === 'cookies') || 
			(
				(this.options.storage === 'localstorage') && 
				jQuery.fn.jplist.dal.services.LocalStorageService.supported()
			);
	};	
		
	/**
	* save statuses to storage according to user options
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
	*/
	jQuery.fn.jplist.dal.Storage.prototype.save = function(statuses){
		save(this, statuses);
	};
	
})();
	