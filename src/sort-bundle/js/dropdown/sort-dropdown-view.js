;(function(){//+
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
		
		var status = null
			,data
			,$li
			,$span
			,dateTimeFormat
			,ignore;	
		
		if(isDefault){
					
			$li = context.$control.find('li:has(span[data-default="true"])').eq(0);
			
			if($li.length <= 0){
				$li = context.$control.find('li:eq(0)');
			}
		}
		else{
			$li = context.$control.find('.active');
		}
		
		//get span
		$span = $li.find('span');
		
		//init datetime format
		dateTimeFormat = context.$control.attr('data-datetime-format') || '';
		
		//init ignore
		ignore = context.$control.attr('data-ignore') || '';
				
		//init status related data
		data = new jQuery.fn.jplist.ui.controls.DropdownSortDTO(
			$span.attr('data-path')
			,$span.attr('data-type')
			,$span.attr('data-order')
			,dateTimeFormat
			,ignore
			,getAdditionalPaths($span)
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
		
			if((propName !== 'number') && (propName !== 'path' + context.options.delimiter2 + 'type' + context.options.delimiter2 + 'order') && (propName !== 'path')){			
				return null;
			}
			
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
	
		context.$control.find('span').each(function(){
		
			var jqPath
				,dataType
				,path;
			
			//init vars
			jqPath = jQuery(this).attr('data-path');
			dataType = jQuery(this).attr('data-type');
			
			//init path
			if(jqPath && jQuery.trim(jqPath) !== ''){
			   
			    //init path
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
				
		var $li
			,$liList;		
		
		//get li list
		$liList = context.$control.find('li');
						
		//remove active class
		$liList.removeClass('active');
		
		//set active class
		if(status.data.path == 'default'){
			$li = context.$control.find('li:has([data-path="default"])');
		}
		else{
			$li = context.$control.find('li:has([data-path="' + status.data.path + '"][data-type="' + status.data.type + '"][data-order="' + status.data.order + '"])');
		}
		
		if($li.length <= 0){
			$li = $liList.eq(0);
		}
		
		$li.addClass('active');
		
		//update dropdown panel
		context.$control.find('.jplist-dd-panel').text($li.eq(0).text());	
	};
	
	/**
	* Init control events
	* @param {Object} context
	*/
	var initEvents = function(context){
		
		/**
		* on li click
		*/
		context.$control.find('li').off('click').on('click', function(){
		
			var status
				,dataPath
				,$span;
			
			status = getStatus(context, false);
			
			$span = jQuery(this).find('span');
			dataPath = $span.attr('data-path');
			
			if(dataPath){			
				status.data.path = dataPath;
				status.data.type = $span.attr('data-type');
				status.data.order = $span.attr('data-order');
				status.data.additionalPaths = getAdditionalPaths($span);			
			}
			
			//send status event	
			context.observer.trigger(context.observer.events.statusChanged, [status]);
		});
	};
	
	/** 
	* Sort Dropdown Control
	* @constructor
	* @param {Object} context
	*/
	var Init = function(context){
		
		//run default dropdown control
		new jQuery.fn.jplist.ui.panel.DropdownControl(context.options, context.observer, context.history, context.$control);
				
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
	* Sort Dropdown Control
	* @constructor
	* @param {Object} context
	*/
	jQuery.fn.jplist.ui.controls.SortDropdown = function(context){
		return new Init(context);
	};	
	
	/**
	* static control registration
	*/
	jQuery.fn.jplist.controlTypes['sort-drop-down'] = {
		className: 'SortDropdown'
		,options: {}
		,dropdown: true
	};		
})();

