(function() {
	'use strict';		
		
	/**
	* Find status by the given field in the statuses array (comparison is not deep, can't compare data object)
	* @param {Object} context
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	* @param {string} field - status field name
	* @return {number} - index of the status in the status list, or -1 if not found
	*/
	var findStatusByField = function(context, status, field){
	
		var index = -1
			,cstatus;
		
		for(var i=0; i<context.statuses.length; i++){
		
			//get dataitem
			cstatus = context.statuses[i];
			
			if(cstatus[field] === status[field]){
				index = i;
				break;
			}
		}
		
		return index;
	};
	
	/**
	* Get statuses by action
	* @param {Object} context
	* @param {string} action
	* @return {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} 
	*/
	var getStatusesByAction = function(context, action){
		
		var resultStatuses = []
			,status;
		
		for(var i=0; i<context.statuses.length; i++){
		
			//get status
			status = context.statuses[i];
			
			if(status.action === action){
				resultStatuses.push(status);
			}
		}
		
		return resultStatuses;
	};
		
	/** 
	* Statuses Collection
	* @constructor 
	* @param {Object} options - jplist user options
	* @param {Object} observer
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
	* @return {Object}
	*/
	var Init = function(options, observer, statuses){
	
		var context = {
            options: options
			,observer: observer
			,statuses: statuses
		};
		
		return jQuery.extend(this, context);
	};
	
	/**
	* Find status by the given field in the statuses array (comparison is not deep, can't compare data object)
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	* @param {string} field - status field name
	* @return {number} - index of the status in the status list, or -1 if not found
	*/
	Init.prototype.findStatusByField = function(status, field){
		return findStatusByField(this, status, field);
	};
	
	/**
	* Get statuses by action
	* @param {string} action
	* @return {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} 
	*/
	Init.prototype.getStatusesByAction = function(action){
		return getStatusesByAction(this, action);
	};
		
	/** 
	* Statuses Collection
	* @constructor 
	* @param {Object} options - jplist user options	
	* @param {Object} observer
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
	*/
	jQuery.fn.jplist.app.dto.StatusesDTOCollection = function(options, observer, statuses){	
		return new Init(options, observer, statuses);
	};
	
})();