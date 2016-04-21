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
			
			if(context.storageType === 'cookies'){
				
				//save statuses to the storage
				jQuery.fn.jplist.dal.services.CookiesService.saveCookies(statusesToSave, context.storageName, context.cookiesExpiration);
			}
			
			if((context.storageType === 'localstorage') && jQuery.fn.jplist.dal.services.LocalStorageService.supported()){
				
				//save statuses to the storage
				jQuery.fn.jplist.dal.services.LocalStorageService.save(statusesToSave, context.storageName);
			}
		}
	};
		
	/**
	 * Storage
     * @constructor
	 * @param {string} storageType - 'cookies' or 'localstorage'
     * @param {string} storageName
     * @param {number} cookiesExpiration
	 * @return {Object}
	 */
	jQuery.fn.jplist.dal.Storage = function(storageType, storageName, cookiesExpiration){

        this.storageType = storageType;
        this.storageName = storageName;
        this.cookiesExpiration = cookiesExpiration;

		this.isStorageEnabled = 
			(storageType === 'cookies') ||
			(
				(storageType === 'localstorage') &&
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
	