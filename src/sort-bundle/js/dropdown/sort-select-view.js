;(function(){
	'use strict';		
		
	/**
	* get additional paths - used for multiple sort
	* <span data-path="..." data-path-1="..." data-path-2="..."
	* @param {jQueryObject} $span
	* @return {Array.<string>} additionalPaths
	*/
	var getAdditionalPaths = function($span){
		
		var additionalPaths = [];
		
		//init additional data-paths used for the multiple sort
		jQuery.each($span.get(0).attributes, function(key, attr){
			
			if(attr.name.indexOf('data-path-') !== -1){				
				additionalPaths.push(attr.value);
			}
		});
		
		return additionalPaths;
	};
	
	/**
	* Get control status
	* @param {Object} context
	* @param {boolean} isDefault - if true, get default (initial) control status; else - get current control status
	* @return {jQuery.fn.jplist.app.dto.StatusDTO}
	*/
	var getStatus = function(context, isDefault){
		
		var $option
			,status = null
			,dateTimeFormat = ''
			,ignore = ''
			,data;	
					
		//get selected option (if default, get option with data-default=true or first option)
		if(isDefault){
		
			$option = context.$control.find('option[data-default="true"]').eq(0);
			if($option.length <= 0){
				$option =  context.$control.find('option').eq(0);
			}
		}
		else{
			$option = context.$control.find('option:selected');
		}
		
		//init datetime format
		dateTimeFormat = context.$control.attr('data-datetime-format') || '';
		
		//init ignore
		ignore = context.$control.attr('data-ignore') || '';
		
		//init status related data
		data = new jQuery.fn.jplist.ui.controls.DropdownSortDTO(
			$option.attr('data-path')
			,$option.attr('data-type')
			,$option.attr('data-order')
			,dateTimeFormat
			,ignore
		);
		
		//create status
		status = new jQuery.fn.jplist.app.dto.StatusDTO(
			context.name
			,context.action
			,context.type
			,data
			,context.inStorage
			,context.inAnimation
			,context.isAnimateToTop
			,context.inDeepLinking
			,getAdditionalPaths($option)
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
			
			if(status.data && status.data.path && status.data.type && status.data.order){
			
				//init deep link
				deepLink = context.name + context.options.delimiter0 + 'path' + context.options.delimiter2 + 'type' + context.options.delimiter2 + 'order=' + status.data.path + context.options.delimiter2 + status.data.type + context.options.delimiter2 + status.data.order;
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
			,status = null
			,sections;
			
		if(context.inDeepLinking){
		
			//get status
			status = getStatus(context, isDefault);
			
			if(status.data){
			
				if(propName === 'path' + context.options.delimiter2 + 'type' + context.options.delimiter2 + 'order'){
					
					sections = propValue.split(context.options.delimiter2);
					
					if(sections.length === 3){
						
						status.data.path = sections[0];
						status.data.type = sections[1];
						status.data.order = sections[2];
					}
				}
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
			,dataType
			,path;
			
		context.$control.find('option').each(function(){
				
			//init vars
			jqPath = jQuery(this).attr('data-path');
			dataType = jQuery(this).attr('data-type');
			
			//init path
			if(jqPath){
			   
				path = new jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel(jqPath, dataType);
				paths.push(path);
			}
		});
	};
		
	/**
	* Set control status
	* @param {Object} context
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	* @param {boolean} restoredFromStorage - is status restored from storage
	*/
	var setStatus = function(context, status, restoredFromStorage){
				
		var $option;
		
		//set active class
		if(status.data.path == 'default'){
			$option = context.$control.find('option[data-path="' + status.data.path + '"]');
		}
		else{
			$option = context.$control.find('option[data-path="' + status.data.path + '"][data-type="' + status.data.type + '"][data-order="' + status.data.order + '"]');
		}
		
		if($option.length > 0){
			$option.get(0).selected = true;				
		}
	};
	
	/**
	* Init control events
	* @param {Object} context
	*/
	var initEvents = function(context){
		
		/**
		* on select change
		*/
		context.$control.on('change', function(){
		
			var status
				,$selectedOption
				,dataPath;
			
			status = getStatus(context, false);
			
			//get selected option
			$selectedOption = jQuery(this).find('option:selected');
			
			//get data
			dataPath = $selectedOption.attr('data-path');
			
			if(dataPath){
			
				status.data.path = dataPath;
				status.data.type = $selectedOption.attr('data-type');
				status.data.order = $selectedOption.attr('data-order');	
				status.data.additionalPaths = getAdditionalPaths($selectedOption);
			}
			
			//send status event
			context.observer.trigger(context.observer.events.statusChanged, [status]);
		});
	};
	
	/** 
	* Select Sort Controls
	* @constructor
	* @param {Object} context
	*/
	var Init = function(context){
					
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
	* Select Sort Controls
	* @constructor
	* @param {Object} context
	*/
	jQuery.fn.jplist.ui.controls.SortSelect = function(context){
		return new Init(context);
	};	
	
	/**
	* static control registration
	*/
	jQuery.fn.jplist.controlTypes['sort-select'] = {
		className: 'SortSelect'
		,options: {}
	};		
})();

