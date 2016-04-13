(function(){
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
			,$li
			,$span;	
			
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
		
		//create status related data
		data = new jQuery.fn.jplist.ui.controls.DropdownPaginationDTO($span.attr('data-number'));
		
		//create status object
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
			
			if(status.data){
			
				if(jQuery.isNumeric(status.data.number) || status.data.number === 'all' ){
					
					//init deep link
					deepLink = context.name + context.options.delimiter0 + 'number=' + status.data.number;
				}
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
		
			if((propName !== 'number') && (propName !== 'path' + context.options.delimiter2 + 'type' + context.options.delimiter2 + 'order') && (propName !== 'path')){			
				return null;
			}
			
			//get status
			status = getStatus(context, isDefault);
			
			if(status.data){
			
				if((propName === 'number') && jQuery.isNumeric(status.data.number)){
					
					//set value
					status.data.number = propValue;
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
			
		context.$control.find('span').each(function(){
				
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
		$li = context.$control.find('li:has([data-number="' + status.data.number + '"])');
		if($li.length === 0){
			$li = context.$control.find('li:has([data-number="all"])');
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
		context.$control.find('li').off().on('click', function(){
		
			var status
				,data_path
				,data_number
				,span;
			
			status = getStatus(context, false);
			
			span = jQuery(this).find('span');
			data_path = span.attr('data-path');
			data_number = span.attr('data-number');
			
			if(data_path){
			
				status.data.path = data_path;
				status.data.type = span.attr('data-type');
				status.data.order = span.attr('data-order');				
			}
			else{
				if(data_number){
					status.data.number = data_number;
				}
			}
			
			//send status event		
			context.observer.trigger(context.observer.events.statusChanged, [status]);
		});
	};
	
	/** 
	* Items Per Page Dropdown Control
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
	* Items Per Page Dropdown Control
	* @constructor
	* @param {Object} context
	*/
	jQuery.fn.jplist.ui.controls.ItemsPerPageDropdown = function(context){
		return new Init(context);
	};	
	
	/**
	* static control registration
	*/
	jQuery.fn.jplist.controlTypes['items-per-page-drop-down'] = {
		className: 'ItemsPerPageDropdown'
		,options: {}
		,dropdown: true
	};		
})();

