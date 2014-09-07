/**
* jPList - jQuery Data Grid Controls ##VERSION## - http://jplist.com 
* Copyright 2014 Miriam Zusin. All rights reserved.
* For non-commercial, personal, or open source projects and applications, you may use jPList for free  http://www.binpress.com/license/read/id/2749/app/2085
* If your project generates any type of income, e.g. sells products, ads, services or just represents a commercial company, you should get a commercial license at http://www.binpress.com
*/
(function(){
	'use strict';		
		
	/**
	* get span with default value
	* @param {Object} context
	* @return {jQueryObject} - span with default value
	*/
	var getSpanWithDefaultValue = function(context){
		
		var $li
			,$span;
		
		$li = context.$control.find('li:has(span[data-default="true"])').eq(0);
			
		if($li.length <= 0){
			$li = context.$control.find('li:eq(0)');
		}
		
		//get span
		$span = $li.find('span');
		
		return $span;
	};
	
	/**
	* Render control html
	* @param {Object} context
	*/
	var render = function(context){
		
		var li
			,span;
			
		//get first li
		li = context.$control.find('li:eq(0)');
		
		li.addClass('active');
		span = li.find('span');
		
		//init panel
		if(context.$control.find('.jplist-dd-panel').length <= 0){
			context.$control.prepend('<div class="jplist-dd-panel">' + span.text() + '</div>');	
		}	
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
			,ignore
			,storageStatus;	
			
		storageStatus = context.$control.data('storage-status');
		
		if(isDefault && storageStatus){			
			status = storageStatus;			
		}
		else{
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
			
			switch(context.action){
				
				case 'paging':{
				
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
				}	
				break;
				
				
				case 'sort':{
									
					//init datetime format
					dateTimeFormat = context.$control.attr('data-datetime-format');
					
					if(!dateTimeFormat){
						dateTimeFormat = '';
					}
					
					//init ignore
					ignore = context.$control.attr('data-ignore');
					
					if(!ignore){
						ignore = '';
					}
					
					//init status related data
					data = new jQuery.fn.jplist.ui.controls.DropdownSortDTO($span.attr('data-path'), $span.attr('data-type'), $span.attr('data-order'), dateTimeFormat, ignore);
					
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
					data = new jQuery.fn.jplist.ui.controls.DropdownFilterDTO($span.attr('data-path'), $span.attr('data-type'));
					
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
						
						if(jQuery.isNumeric(status.data.number) || status.data.number === 'all' ){
							
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
		
			if((propName !== 'number') && (propName !== 'path' + context.options.delimiter2 + 'type' + context.options.delimiter2 + 'order') && (propName !== 'path')){			
				return null;
			}
			
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
			,$span = null
			,$liList;		
		
		//savestorages status
		if(context.inStorage && restoredFromStorage){			
			context.$control.data('storage-status', status);	
		}
		
		if(!context.inStorage && restoredFromStorage){
			$span = getSpanWithDefaultValue(context);
		}
		
		//get li list
		$liList = context.$control.find('li');
		
		switch(context.action){
				
			case 'filter':{
			
				if(!context.inStorage && restoredFromStorage && $span.length > 0){
										
					status.data.path = $span.attr('data-path');
					status.data.type = $span.attr('data-type');
					
					//send status event		
					context.history.addStatus(status);
					context.observer.trigger(context.observer.events.statusEvent, [status]);
				}
				else{
					//remove active class
					$liList.removeClass('active');
					
					//set active class
					$li = context.$control.find('li:has([data-path="' + status.data.path + '"])');
					
					if($li.length <= 0){
						$li = $liList.eq(0);
					}
					
					$li.addClass('active');
					
					//update dropdown panel
					context.$control.find('.jplist-dd-panel').text($li.eq(0).text());	
				}				
			}
			break;
			
			case 'sort':{
				
				if(!context.inStorage && restoredFromStorage && $span.length > 0){
										
					status.data.path = $span.attr('data-path');
					status.data.type = $span.attr('data-type');
					status.data.order = $span.attr('data-order');					
										
					//send status event		
					context.history.addStatus(status);
					context.observer.trigger(context.observer.events.statusEvent, [status]);
				}
				else{					
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
				}				
			}
			break;
			
			case 'paging':{
				
				if(!context.inStorage && restoredFromStorage && $span.length > 0){
										
					status.data.number = $span.attr('data-number');
					
					//send status event		
					context.history.addStatus(status);
					context.observer.trigger(context.observer.events.statusEvent, [status]);
				}
				else{					
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
				}
			}
			break;
		}
	};
	
	/**
	* Init control events
	* @param {Object} context
	*/
	var initEvents = function(context){
		
		var dropdowns = jQuery(document).find('[data-control-type="drop-down"]');
		
		jQuery(document).click(function(){
			dropdowns.find('ul').hide();
		});
		
		jQuery(document).off('jplist_dropdown_close').on('jplist_dropdown_close', function(event, jq_dropdown){
		
			dropdowns.each(function(){
				if(!jQuery(this).is(jq_dropdown)){
					jQuery(this).find('ul').hide();
				}
			});
		});
		
		context.$control.find('.jplist-dd-panel').off().click(function(event){
			
			var dropdown
				,ul;
				
			//stop propagation
			event.stopPropagation();
			
			dropdown = jQuery(this).parents('[data-control-type]');	
			ul = dropdown.find('ul');
			
			//close other dropdowns
			jQuery(document).trigger('jplist_dropdown_close', [dropdown]);
			
			//current dropdown			
			if(ul.is(':visible')){
				ul.hide();
			}
			else{
				ul.show();
			}
		});
		
		context.$control.find('li').off().click(function(){
		
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
				
		//render control
		render(context);
		
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
	jQuery.fn.jplist.ui.controls.Dropdown = function(context){
		return new Init(context);
	};	
	
	/**
	* static control registration
	*/
	jQuery.fn.jplist.controlTypes['drop-down'] = {
		className: 'Dropdown'
		,options: {}
	};		
})();

