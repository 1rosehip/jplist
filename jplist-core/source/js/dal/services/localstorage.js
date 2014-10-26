(function(){
	'use strict';		
	
	/** 
	* Local Storage
	* @type {Object}
	*/
	jQuery.fn.jplist.dal.services.LocalStorageService = {};
	
	/**
	* Returns if local storage is supported by the given browser
	* @return {boolean}
	*/
	jQuery.fn.jplist.dal.services.LocalStorageService.supported = function(){
		
		try{
			return 'localStorage' in window && window['localStorage'] !== null;
		} 
		catch(e){
			return false;
		}
	};
	
	/**
	* Save status objects list to local storage
	* @param {Array.<Object>} statuses - list of status objects
	* @param {string} storageName - local storage name
	*/
	jQuery.fn.jplist.dal.services.LocalStorageService.save = function(statuses, storageName){
		
		var json;
		
		//get statuses json
		json = JSON.stringify(statuses);
		
		//save json in local storage
		window.localStorage[storageName] = json;
	};
	
	/**
	* Restore status objects list from local storage	
	* @param {string} storageName - local storage name
	* @return {Array.<Object>} - list of status objects
	*/
	jQuery.fn.jplist.dal.services.LocalStorageService.restore = function(storageName){
		
		var json
			,statuses = [];
		
		//get json from local storage
		json = window.localStorage[storageName];		
		
		if(json){
		
			//get statuses from json
			statuses = jQuery.parseJSON(json);
		}
		
		if(!statuses){
			statuses = [];
		}		
				
		return statuses;
	};
	
})();

