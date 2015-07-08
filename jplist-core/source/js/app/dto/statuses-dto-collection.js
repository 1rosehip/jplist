/*
Statuses Collection (Data Transfer Objects)
*/
;(function() {
	'use strict';		
	
	/**
	* Get statuses with the same field: value
	* @param {Object} context
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
	* @param {string} field
	* @param {string|null} value
	* @return {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} 
	*/
	var getStatusesByFieldAndValue = function(context, statuses, field, value){
		
		var resultStatuses = []
			,status;
		
		for(var i=0; i<context.statuses.length; i++){
		
			//get status
			status = context.statuses[i];
			
			if(status[field] === value){
				status.initialIndex = i;
				resultStatuses.push(status);
			}
		}
		
		return resultStatuses;
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
	* get status by index
	* @param {Object} context
	* @param {number} index
	* @return {jQuery.fn.jplist.app.dto.StatusDTO}
	*/
	var get = function(context, index){
		
		var status = null;
		
		if(index >= 0 && index < context.statuses.length){
			status = context.statuses[index];
		}
		
		return status;
	};
	
	/**
	* add and merge status
	* @param {Object} context
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	* @param {boolean} force - if this status should be prefered on other statuses
	*/
	var add = function(context, status, force){
		
		var currentStatus
			,mergedStatus
			,shouldWarn
			,statusesWithTheSameAction
			,statusesWithTheSameActionAndName
			,warnProperties;
		
		if(context.statuses.length === 0){
			context.statuses.push(status);
		}
		else{
		
			statusesWithTheSameAction = getStatusesByFieldAndValue(context, context.statuses, 'action', status.action);
			
			if(statusesWithTheSameAction.length === 0){
				
				context.statuses.push(status);
			}
			else{
				statusesWithTheSameActionAndName = getStatusesByFieldAndValue(context, statusesWithTheSameAction, 'name', status.name);		

				if(statusesWithTheSameActionAndName.length === 0){
				
					context.statuses.push(status);
				}
				else{
					
					for(var i = 0; i<statusesWithTheSameActionAndName.length; i++){
						
						currentStatus = statusesWithTheSameActionAndName[i];
						
						if(currentStatus.type === status.type){
							
							if(force){
								context.statuses[currentStatus.initialIndex] = status;
							}
							else{
							
								//warn ...
								if(currentStatus.data && status.data){
									
									shouldWarn = false;
									warnProperties = [];
									
									jQuery.each(currentStatus.data, function(property, value){	

										if(status[property] !== value){
											shouldWarn = true;
											warnProperties.push(property + ': ' + status[property] + ' !== ' + value);
										}
									});
									
									if(shouldWarn){
									
										jQuery.fn.jplist.warn(context.options, 'The statuses have the same name, action and type, but different data values', [currentStatus, status, warnProperties]);
									}
								}
							}
						}
						else{
							//merge
							context.statuses[currentStatus.initialIndex] = jQuery.extend(true, {}, currentStatus, status);
							context.statuses[currentStatus.initialIndex].type = 'combined';
						}
					}
				}
			}		
		}
	};
	
	/**
	* get array of statuses
	* @param {Object} context
	* @return {Array.<jQuery.fn.jplist.app.dto.StatusDTO>}
	*/	
	var toArray = function(context){
		return context.statuses;
	};

	/**
	* get all sort statuses, expand statuses group if needed
	* @param {Object} context
	* @return {Array.<jQuery.fn.jplist.app.dto.StatusDTO>}
	*/
	var getSortStatuses = function(context){
		
		var actionStatuses
			,actionStatus
			,statusesAfterGroupExpanding = []
			,tempStatus;
		
		//get sort statuses		
		actionStatuses = getStatusesByAction(context, 'sort');
			
        if(jQuery.isArray(actionStatuses)){
		
			for(var i=0; i<actionStatuses.length; i++){
				
				actionStatus = actionStatuses[i];
				
				if(actionStatus && 
					actionStatus.data && 
					actionStatus.data['sortGroup'] && 
					jQuery.isArray(actionStatus.data['sortGroup']) && 
					actionStatus.data['sortGroup'].length > 0){
					
					for(var j=0; j<actionStatus.data['sortGroup'].length; j++){
						
						tempStatus = new jQuery.fn.jplist.app.dto.StatusDTO(
							actionStatus.name
							,actionStatus.action
							,actionStatus.type
							,actionStatus.data['sortGroup'][j]
							,actionStatus.inStorage
							,actionStatus.inAnimation
							,actionStatus.isAnimateToTop
							,actionStatus.inDeepLinking
						);
						
						statusesAfterGroupExpanding.push(tempStatus);
					}					
				}
				else{
					statusesAfterGroupExpanding.push(actionStatus);
				}
			}
		}
			
		return statusesAfterGroupExpanding;
	};
	
	/**
	* split statuses list to groups by the given status property
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
	* @param {string} property
	* @return {Object}
	*/
	var splitToGroupsByProperty = function(statuses, property){
		
		var groups = {}
			,status
			,value;
		
		//split to groups by action
		for(var i = 0; i<statuses.length; i++){
			
			status = statuses[i];			
			value = status[property];
			
			if(!groups[value]){
				groups[value] = [];
			}
			
			groups[value].push(status);
		}
		
		return groups;
	};
	
	/**
	* get all filter statuses that have registered filter services
	* @param {Object} context
	* @return {Array.<jQuery.fn.jplist.app.dto.StatusDTO>}
	*/
	var getFilterStatuses = function(context){
		
		var filterStatuses
			,status
			,filterService
			,registeredFilterStatuses = [];
		
		//get filter statuses		
		filterStatuses = getStatusesByAction(context, 'filter');
		
		if(jQuery.isArray(filterStatuses)){

			for(var i=0; i<filterStatuses.length; i++){

				//get status
				status = filterStatuses[i];
				
				if(status && status.data && status.data.filterType){
									
					//get filter service
					filterService = jQuery.fn.jplist.app.services.DTOMapperService.filters[status.data.filterType];
					
					if(jQuery.isFunction(filterService)){
					
						registeredFilterStatuses.push(status);
					}
				}
			}
		}
		
		return registeredFilterStatuses;
	};
	
	/** 
	* Statuses Collection
	* @constructor 
	* @param {Object} options - jplist user options	
	* @param {Object} observer
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
	*/
	jQuery.fn.jplist.app.dto.StatusesDTOCollection = function(options, observer, statuses){		
	
		this.options = options;
		this.observer = observer;
		this.statuses = statuses || [];
	};
		
	/**
	* Get statuses by action
	* @param {string} action
	* @return {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} 
	*/
	jQuery.fn.jplist.app.dto.StatusesDTOCollection.prototype.getStatusesByAction = function(action){
		return getStatusesByAction(this, action);
	};
	
	/**
	* add status
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	* @param {boolean} force - if this status should be prefered on other statuses
	*/
	jQuery.fn.jplist.app.dto.StatusesDTOCollection.prototype.add = function(status, force){
		return add(this, status, force);
	};
	
	/**
	* get status by index
	* @param {number} index
	* @return {jQuery.fn.jplist.app.dto.StatusDTO}
	*/
	jQuery.fn.jplist.app.dto.StatusesDTOCollection.prototype.get = function(index){		
		return get(this, index);
	};
	
	/**
	* get array of statuses
	* @return {Array.<jQuery.fn.jplist.app.dto.StatusDTO>}
	*/	
	jQuery.fn.jplist.app.dto.StatusesDTOCollection.prototype.toArray = function(){
		return toArray(this);
	};
	
	/**
	* get all sort statuses, expand statuses group if needed
	* @return {Array.<jQuery.fn.jplist.app.dto.StatusDTO>}
	*/
	jQuery.fn.jplist.app.dto.StatusesDTOCollection.prototype.getSortStatuses = function(){
		return getSortStatuses(this);
	};
	
	/**
	* get all filter statuses that have registered filter services
	* @return {Array.<jQuery.fn.jplist.app.dto.StatusDTO>}
	*/
	jQuery.fn.jplist.app.dto.StatusesDTOCollection.prototype.getFilterStatuses = function(){
		return getFilterStatuses(this);
	};
	
})();