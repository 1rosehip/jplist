(function(){//+
	'use strict';		
	
	/**
	* Get control status
	* @param {Object} context
	* @param {boolean} isDefault - if true, get default (initial) control status; else - get current control status
	* @return {jQuery.fn.jplist.app.dto.StatusDTO}
	*/
	var getStatus = function(context, isDefault){
		
		var status = null
			,data
			,selected;
				
		if(isDefault){	
		
			//if default, get the initial value
			selected = context.params.initialSelected || false;
		}
		else{
			selected = context.$control.get(0).checked;
		}		
		
		data = {
			path: context.$control.attr('data-path')
			,type: 'TextFilter'
			,filterType: 'path'
			,selected: selected
		};		
			
		if(!selected){
			data.filterType = '';
		}

		status = new jQuery.fn.jplist.app.dto.StatusDTO(
			context.name
			,context.action
			,context.type
			,data
			,context.inStorage
			,context.inAnimation
			,context.isAnimateToTop
			,context.inDeepLinking
		);
		
		return status;
	};
	
	/**
	* Get deep link
	* @param {Object} context
	* @return {string} deep link
	*/
	var getDeepLink = function(context){
		
		var deepLink = ''
			,status
			,isDefault = false;
		
		if(context.inDeepLinking){
		
			//get status
			status = getStatus(context, isDefault);
			
			if(status.data && status.data.selected){
					
				//init deep link
				deepLink = context.name + context.options.delimiter0 + 'selected=true';
			}
		}
		
		return deepLink;
	};
	
	/**
	* get status by deep link
	* @param {Object} context
	* @param {string} propName - deep link property name
	* @param {string} propValue - deep link property value
	* @return {jQuery.fn.jplist.app.dto.StatusDTO}
	*/
	var getStatusByDeepLink = function(context, propName, propValue){
		
		var isDefault = true
			,status = null;
		
		if(context.inDeepLinking){
		
			//get status
			status = getStatus(context, isDefault);
			
			if(status.data && propName === 'selected'){
			
				//set current page
				status.data.selected = true;
			}
		}
		
		return status;
	};
	
	/**
	* Get control paths
	* @param {Object} context
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel>} paths
	*/
	var getPaths = function(context, paths){
	
		var jqPath
			,path;		
				
		//ger data-path attribute
		jqPath = context.$control.attr('data-path');
		
		//init path
		if(jqPath){
		
			path = new jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel(jqPath, 'text');
			paths.push(path);
		}
	};
		
	/**
	* set statuses by deep links
	* @param {Object} context
	* @param {Array.<Object>} params - array of params {controlName: '...', propName: '...', propValue: '...'}
	*/
	var setByDeepLink = function(context, params){
	
		//render statuses again
		context.observer.trigger(context.observer.events.statusChanged, [getStatus(context, false)]);
	};
	
	/**
	* Set control status
	* @param {Object} context
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	* @param {boolean} restoredFromStorage - is status restored from storage
	*/
	var setStatus = function(context, status, restoredFromStorage){
		
		context.$control.get(0).checked = status.data.selected || false;
	};
	
	/**
	* Init control events
	* @param {Object} context
	*/
	var initEvents = function(context){
		
		context.$control.on('change', function(){
			
			//add status to the history object
			context.history.addStatus(getStatus(context, false));
			
			//force render statuses event
			context.observer.trigger(context.observer.events.unknownStatusesChanged, [false]);
		});
		
	};
	
	/** 
	* Dropdown control: sort dropdown, filter dropdown, paging dropdown etc.
	* @constructor
	* @param {Object} context
	*/
	var Init = function(context){
			
		context.params = {
			initialSelected: context.$control.get(0).checked || false
		};
		
		//init events
		initEvents(context);
		
		return jQuery.extend(this, context);
	};
	
	/**
	* Get control status
	* @param {boolean} isDefault - if true, get default (initial) control status; else - get current control status
	* @return {jQuery.fn.jplist.app.dto.StatusDTO}
	*/
	Init.prototype.getStatus = function(isDefault){
		return getStatus(this, isDefault);
	};
	
	/**
	* Get Deep Link
	* @return {string} deep link
	*/
	Init.prototype.getDeepLink = function(){
		return getDeepLink(this);
	};
	
	/**
	* Get Paths by Deep Link
	* @param {string} propName - deep link property name
	* @param {string} propValue - deep link property value
	* @return {jQuery.fn.jplist.app.dto.StatusDTO}
	*/
	Init.prototype.getStatusByDeepLink = function(propName, propValue){
		return getStatusByDeepLink(this, propName, propValue);
	};
	
	/**
	* Get Paths
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel>} paths
	*/
	Init.prototype.getPaths = function(paths){
		getPaths(this, paths);
	};
	
	/**
	* Set Status
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	* @param {boolean} restoredFromStorage - is status restored from storage
	*/
	Init.prototype.setStatus = function(status, restoredFromStorage){
		setStatus(this, status, restoredFromStorage);
	};
	
	/**
	* set statuses by deep links
	* @param {Array.<Object>} params - array of params {controlName: '...', propName: '...', propValue: '...'}
	*/
	Init.prototype.setByDeepLink = function(params){
		setByDeepLink(this, params);
	};
	
	/** 
	* Radio button filter control
	* @constructor
	* @param {Object} context
	*/
	jQuery.fn.jplist.ui.controls.RadioButtonsFilter = function(context){
		return new Init(context);
	};	
	
	/**
	* static control registration
	*/
	jQuery.fn.jplist.controlTypes['radio-buttons-filters'] = {
		className: 'RadioButtonsFilter'
		,options: {}
	};		
})();

