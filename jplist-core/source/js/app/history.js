(function(){
	'use strict';	
		
	/**
	* get last status from the history
	* @param {Object} context
	* @return {jQuery.fn.jplist.app.dto.StatusDTO} status
	*/
	var getLastStatus = function(context){
		
		var lastStatus = null;
		
		if(context.statusesQueue.length > 0){
			lastStatus = context.statusesQueue[context.statusesQueue.length - 1];
		}
		
		return lastStatus;
	};
	
	/**
	* add status to the history
	* @param {Object} context
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	*/
	var addStatus = function(context, status){
	
		//add status to the end
		context.statusesQueue.push(status);
		
		if(context.statusesQueue.length > context.options.historyLength){
			
			//remove a status from the beginning of the queue
			context.statusesQueue.shift();
		}		
	};
	
	/**
	* remove the last status from the history and return it
	* @param {Object} context
	* @return {jQuery.fn.jplist.app.dto.StatusDTO} status
	*/
	var popStatus = function(context){
	
		var status = null;
		
		if(context.statusesQueue.length > 0){
			
			//remove a status from the end of the queue and return it
			status = context.statusesQueue.pop();
		}	

		return status;
	};
	
	//List Status
	
	/**
	* get last list of statuses from the history
	* @param {Object} context
	* @return {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} list
	*/
	var getLastList = function(context){
		
		var lastList = null;
		
		if(context.listStatusesQueue.length > 0){
			lastList = context.listStatusesQueue[context.listStatusesQueue.length - 1];
		}
		
		return lastList;
	};
	
	/**
	* add list of statuses to the history
	* @param {Object} context
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} list
	*/
	var addList = function(context, list){
	
		//add list to the end
		context.listStatusesQueue.push(list);
		
		if(context.listStatusesQueue.length > context.options.historyLength){
			
			//remove a list from the beginning of the queue
			context.listStatusesQueue.shift();
		}		
	};
	
	/**
	* remove the last list of statuses from the history and return it
	* @param {Object} context
	* @return {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} list
	*/
	var popList = function(context){
	
		var list = null;
		
		if(context.listStatusesQueue.length > 0){
			
			//remove a list from the end of the queue and return it
			list = context.listStatusesQueue.pop();
		}	

		return list;
	};
	
	//Common
	
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
			,statusesQueue: []
			,listStatusesQueue: []
		};	
				
		return jQuery.extend(this, context);
	};
	
	/**
	* add status to the history
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	*/
	Init.prototype.addStatus = function(status){
		addStatus(this, status);
	};
	
	/**
	* get last status from the history
	* @return {jQuery.fn.jplist.app.dto.StatusDTO} status
	*/
	Init.prototype.getLastStatus = function(){
		return getLastStatus(this);
	};
	
	/**
	* remove last status from the history
	* @return {jQuery.fn.jplist.app.dto.StatusDTO} status
	*/
	Init.prototype.popStatus = function(){
		return popStatus(this);
	};
	
	/**
	* get last list of statuses from the history
	* @return {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} list
	*/
	Init.prototype.getLastList = function(){
		return getLastList(this);
	};
	
	/**
	* add list of statuses to the history
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} list
	*/
	Init.prototype.addList = function(list){	
		addList(this, list);	
	};
	
	/**
	* remove the last list of statuses from the history and return it
	* @return {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} list
	*/
	Init.prototype.popList = function(){
		return popList(this);
	};
	
	/**
	* History
	* @param {jQueryObject} $root - jplist jquery element
	* @param {Object} options - jplist user options
	* @param {Object} observer
	* @return {Object}
	* @constructor 
	*/
	jQuery.fn.jplist.app.History = function($root, options, observer){
				
		//call constructor
		return new Init($root, options, observer);
	};
})();
	