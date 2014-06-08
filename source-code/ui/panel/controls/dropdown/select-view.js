/**
* jQuery jPList Plugin ##VERSION## 
* Copyright 2014 Miriam Zusin. All rights reserved.
* http://jplist.com 
*/
(function(){
	'use strict';		
		
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
			,data
			,storageStatus;	
			
		storageStatus = context.$control.data('storage-status');
		
		if(isDefault && storageStatus){			
			status = storageStatus;
		}
		else{
		
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
			
			switch(context.action){
			
				case 'paging':{
				
					//create status related data
					data = new jQuery.fn.jplist.ui.controls.DropdownPaginationDTO($option.attr('data-number'));
					
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
				}
				break;
				
				case 'sort':{
									
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
					);			
				}
				break;
				
				case 'filter':{
					
					//create status related data				
					data = new jQuery.fn.jplist.ui.controls.DropdownFilterDTO($option.attr('data-path'), $option.attr('data-type'));
					
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
				}
				break;
			}
		
		}
		
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
			
				switch(context.action){
					
					case 'paging':{
						
						if(jQuery.isNumeric(status.data.number)){
							
							//init deep link
							deepLink = context.name + context.options.delimiter0 + 'number=' + status.data.number;
						}
					}	
					break;			
					
					case 'sort':{
										
						if(status.data.path && status.data.type && status.data.order){
							
							//init deep link
							deepLink = context.name + context.options.delimiter0 + 'path' + context.options.delimiter2 + 'type' + context.options.delimiter2 + 'order=' + status.data.path + context.options.delimiter2 + status.data.type + context.options.delimiter2 + status.data.order;
						}
					}
					break;
					
					case 'filter':{
						
						if(status.data.path){
							
							//init deep link
							deepLink = context.name + context.options.delimiter0 + 'path=' + status.data.path;
						}
					}
					break;
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
			,status = null
			,sections;
			
		if(context.inDeepLinking){
		
			//get status
			status = getStatus(context, isDefault);
			
			if(status.data){
			
				switch(context.action){
						
					case 'paging':{
					
						if((propName === 'number') && jQuery.isNumeric(status.data.number)){
							
							//set value
							status.data.number = propValue;
						}					
					}	
					break;			
					
					case 'sort':{
										
						if(propName === 'path' + context.options.delimiter2 + 'type' + context.options.delimiter2 + 'order'){
							
							sections = propValue.split(context.options.delimiter2);
							
							if(sections.length === 3){
								
								status.data.path = sections[0];
								status.data.type = sections[1];
								status.data.order = sections[2];
							}
						}
					}
					break;
					
					case 'filter':{
						
						if((propName === 'path') && status.data.path){
							
							//set value
							status.data.path = propValue;
						}	
					}
					break;
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
		
		//savestorages status
		if(context.inStorage && restoredFromStorage){			
			context.$control.data('storage-status', status);	
		}
				
		switch(context.action){
		
			case 'filter':{
				
				if(!context.inStorage && restoredFromStorage){				
					status.data.path = 'default';	
					context.history.addStatus(status);
					context.observer.trigger(context.observer.events.statusEvent, [status]);
				}
				else{					
					$option = context.$control.find('option[data-path="' + status.data.path + '"]');
					
					if($option && $option.length > 0){
						$option.get(0).selected = true;		
					}
				}				
			}
			break;
			
			case 'sort':{
				
				if(!context.inStorage && restoredFromStorage){				
					status.data.path = 'default';
					context.history.addStatus(status);
					context.observer.trigger(context.observer.events.statusEvent, [status]);
				}
				else{
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
				}
			}
			break;
			
			case 'paging':{
				
				$option = context.$control.find('option[data-number="' + status.data.number + '"]');
				if($option.length === 0){
					$option = context.$control.find('option[data-number="all"]');
				}
				$option.get(0).selected = true;
			}
			break;
		}
	};
	
	/**
	* Init control events
	* @param {Object} context
	*/
	var initEvents = function(context){
		
		context.$control.change(function(){
		
			var status
				,selectedOption
				,data_path
				,data_number;
			
			status = getStatus(context, false);
			
			//get selected option
			selectedOption = jQuery(this).find('option:selected');
			
			//get data
			data_path = selectedOption.attr('data-path');
			data_number = selectedOption.attr('data-number');
			
			if(data_path){
			
				status.data.path = data_path;
				status.data.type = jQuery(this).attr('data-type');
				status.data.order = jQuery(this).attr('data-order');				
			}
			else{
				if(data_number){
					status.data.number = data_number;
				}
			}
			
			//send status event			
			context.history.addStatus(status);
			context.observer.trigger(context.observer.events.statusEvent, [status]);
		});
	};
	
	/** 
	* Dropdown control: sort dropdown, filter dropdown, paging dropdown etc.
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
	* Dropdown control: sort dropdown, filter dropdown, paging dropdown etc.
	* @constructor
	* @param {Object} context
	*/
	jQuery.fn.jplist.ui.controls.Select = function(context){
		return new Init(context);
	};	
		
})();

