/**
* jPList - jQuery Data Grid Controls ##VERSION## - http://jplist.com 
* Copyright 2014 Miriam Zusin. All rights reserved.
* For non-commercial, personal, or open source projects and applications, you may use jPList for free  http://www.binpress.com/license/read/id/2749/app/2085
* If your project generates any type of income, e.g. sells products, ads, services or just represents a commercial company, you should get a commercial license at http://www.binpress.com
*/
(function(){
	'use strict';	
	
	/**
	* save statuses to storage according to user options
	* @param {Object} context
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
	*/
	var save = function(context, statuses){
		
		//check storage
		if(context.isStorageEnabled){
		
			if(context.options.storage === 'cookies'){
				
				//save statuses to the storage
				jQuery.fn.jplist.dal.services.CookiesService.saveCookies(statuses, context.options.storageName, context.options.cookiesExpiration);
			}
			
			if((context.options.storage === 'localstorage') && jQuery.fn.jplist.dal.services.LocalStorageService.supported()){
				
				//save statuses to the storage
				jQuery.fn.jplist.dal.services.LocalStorageService.save(statuses, context.options.storageName);
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
	