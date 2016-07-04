(function(){//+
	'use strict';		
		
	/**
	* get default button
	* @param {Object} context
	* @return {jQueryObject}
	*/
	var getDefaultButton = function(context){
		
		var $btn;
		
		$btn = context.params.$buttons.filter('[data-default="true"]').eq(0);
		
		if($btn.length <= 0){
			$btn = context.params.$buttons.eq(0);
		}
		
		return $btn;
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
	* @return {jQuery.fn.jplist.StatusDTO}
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
	* Get control status
	* @param {Object} context
	* @param {boolean} isDefault - if true, get default (initial) control status; else - get current control status
	* @return {jQuery.fn.jplist.StatusDTO}
	*/
	var getStatus = function(context, isDefault){
		
		var status = null
			,$btn
			,data;	
		
		if(isDefault){
		
			$btn = getDefaultButton(context);
		}
		else{
			$btn = context.params.$buttons.filter('[data-jplist-selected="true"]');
		}
		
		//init status related data
		data = new jQuery.fn.jplist.controls.BootSortDropdownDTO(
			$btn.attr('data-path')
			,$btn.attr('data-type')
			,$btn.attr('data-order')
			,context.params.dateTimeFormat
			,context.params.ignore
		);
		
		//create status
		status = new jQuery.fn.jplist.StatusDTO(
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
	* Set control status
	* @param {Object} context
	* @param {jQuery.fn.jplist.StatusDTO} status
	* @param {boolean} restoredFromStorage - is status restored from storage
	*/
	var setStatus = function(context, status, restoredFromStorage){
		
		var $btn;
		
		//remove selected attributes
		context.params.$buttons.attr('data-jplist-selected', false);
		
		//set active button
		if(status.data.path == 'default'){
			$btn = getDefaultButton(context);
		}
		else{
			$btn = context.params.$buttons.filter('[data-path="' + status.data.path + '"][data-type="' + status.data.type + '"][data-order="' + status.data.order + '"]');
		}
		
		if($btn.length > 0){
			$btn.attr('data-jplist-selected', true);
			
			//update selected text
			context.params.$textBox.text($btn.text());
		}
	};
	
	/**
	* Get control paths
	* @param {Object} context
	* @param {Array.<jQuery.fn.jplist.PathModel>} paths
	*/
	var getPaths = function(context, paths){
	
		var jqPath
			,dataType
			,path;
			
		context.params.$buttons.each(function(){
				
			//init vars
			jqPath = jQuery(this).attr('data-path');
			dataType = jQuery(this).attr('data-type');
			
			//init path
			if(jqPath && jQuery.trim(jqPath) !== ''){
			   
			    //init path
				path = new jQuery.fn.jplist.PathModel(jqPath, dataType);
				paths.push(path);
			}
		});
	};
	
	/**
	* Init control events
	* @param {Object} context
	*/
	var initEvents = function(context){
				
		/**
		* on button click
		*/
		context.params.$buttons.on('click', function(e){
		
			var status
				,$btn = jQuery(this)
				,dataPath;
			
			//don't open buttons as links
			e.preventDefault();
			
			status = getStatus(context, false);
			
			dataPath = $btn.attr('data-path');
			
			if(dataPath){			
				status.data.path = dataPath;
				status.data.type = $btn.attr('data-type');
				status.data.order = $btn.attr('data-order');				
			}
			
			//send status event
			context.observer.trigger(context.observer.events.knownStatusesChanged, [[status]]);
		});
	};
	
	/** 
	* Bootstrap Sort Dropdown Control
	* @constructor
	* @param {Object} context
	*/
	var Init = function(context){
		
		context.params = {
			$textBox: context.$control.find('[data-type="selected-text"]')
			,$buttons: context.$control.find('[data-path]')
			
			,dateTimeFormat: context.$control.attr('data-datetime-format') || ''
			,ignore: context.$control.attr('data-ignore') || ''
		};
						
		//init events
		initEvents(context);
		
		return jQuery.extend(this, context);
	};
	
	/**
	* Get Paths
	* @param {Array.<jQuery.fn.jplist.PathModel>} paths
	*/
	Init.prototype.getPaths = function(paths){
		getPaths(this, paths);
	};
		
	/**
	* Get control status
	* @param {boolean} isDefault - if true, get default (initial) control status; else - get current control status
	* @return {jQuery.fn.jplist.StatusDTO}
	*/
	Init.prototype.getStatus = function(isDefault){
		return getStatus(this, isDefault);
	};
			
	/**
	* Set Status
	* @param {jQuery.fn.jplist.StatusDTO} status
	* @param {boolean} restoredFromStorage - is status restored from storage
	*/
	Init.prototype.setStatus = function(status, restoredFromStorage){
		setStatus(this, status, restoredFromStorage);
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
	* @return {jQuery.fn.jplist.StatusDTO}
	*/
	Init.prototype.getStatusByDeepLink = function(propName, propValue){
		return getStatusByDeepLink(this, propName, propValue);
	};
	
	/** 
	* Bootstrap Sort Dropdown Control
	* @constructor
	* @param {Object} context
	*/
	jQuery.fn.jplist.controls.BootSortDropdown = function(context){
		return new Init(context);
	};	
	
	/**
	* static control registration
	*/
	jQuery.fn.jplist.controlTypes['boot-sort-drop-down'] = {
		className: 'BootSortDropdown'
		,options: {}
		,dropdown: true
	};		
})();

