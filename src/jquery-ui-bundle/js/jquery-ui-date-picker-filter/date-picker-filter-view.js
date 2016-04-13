(function(){
	'use strict';		
		
	/**
	* Render control html
	* @param {Object} context
	*/
	var render = function(context){
		
		var datePickerOptions = {};
				
		//init empty control onchange
		context.$control.off('change').on('change', function(){
		
			var status;
			
			if(jQuery.trim(jQuery(this).val()) === ''){
			
				status = getStatus(context, false);
				
				context.history.addStatus(status);
				context.observer.trigger(context.observer.events.statusChanged, [status]);
			}
		});
		
		//init datepicker options
        datePickerOptions['onSelect'] = function(dateText, inst){
			
			context.history.addStatus(getStatus(context, false));
			context.observer.trigger(context.observer.events.statusChanged, [getStatus(context, false)]);
		};
		
		//start datepicker
		context.params.datepickerFunc(context.$control, datePickerOptions);
	};
		
	/**
	* Get control status
	* @param {Object} context
	* @param {boolean} isDefault - if true, get default (initial) control status; else - get current control status
	* @return {jQuery.fn.jplist.app.dto.StatusDTO}
	*/
	var getStatus = function(context, isDefault){
		
		var status = null
			,data = null
			,currentDate = null;	
				
		if(!isDefault){
			
			//get current datetime from datepicker
			currentDate = context.$control['datepicker']('getDate');
		}
		
		data = new jQuery.fn.jplist.ui.controls.DatePickerFilterDTO(context.params.dataPath, context.params.dateTimeFormat, currentDate);		
		
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
				
				if(jQuery.isNumeric(status.data.year) && jQuery.isNumeric(status.data.month) && jQuery.isNumeric(status.data.day)){
					
					//init deep link
					deepLink += context.name + context.options.delimiter0 + 'date=' + status.data.year + context.options.delimiter2 + status.data.month + context.options.delimiter2 + status.data.day;
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
			
			if(status.data && propName === 'date'){
			
				sections = propValue.split(context.options.delimiter2);
				
				if(sections.length === 3){
				
					status.data.year = sections[0];
					status.data.month = sections[1];
					status.data.day = sections[2];
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
	
		var path;
		
		//init path
		if(context.params.dataPath){
		   
			path = new jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel(context.params.dataPath, 'datetime');
			paths.push(path);
		}	
	};
		
	/**
	* Set control status
	* @param {Object} context
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	* @param {boolean} restoredFromStorage - is status restored from storage
	*/
	var setStatus = function(context, status, restoredFromStorage){
				
		var currentDate;
						
		if(jQuery.isNumeric(status.data.year) && 
			jQuery.isNumeric(status.data.month) && 
			jQuery.isNumeric(status.data.day)){
			
			//init dates
			currentDate = new Date(status.data.year, status.data.month, status.data.day);	
			context.$control['datepicker']('setDate', currentDate);						
		}
		else{
			context.$control.val('');
		}
		
	};
	
	/**
	* init user defined functions
	*/
	var initUserDefinedFunctions = function(context){
		
		var datePickerFunc = context.$control.attr('data-datepicker-func');
	
		if(jQuery.isFunction(jQuery.fn.jplist.settings[datePickerFunc])){
			context.params.datepickerFunc = jQuery.fn.jplist.settings[datePickerFunc];
		}
	};
	
	/** 
	* jQuery UI date picker filter
	* @constructor
	* @param {Object} context
	*/
	var Init = function(context){
				
		context.params = {
			datepickerFunc: function(){}
			,dataPath: context.$control.attr('data-path')
			,dateTimeFormat: context.$control.attr('data-datetime-format')
		};
		
		//set user defined functions
		initUserDefinedFunctions(context);
		
		//render control
		render(context);
		
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
	* jQuery UI date pciker filter
	* @constructor
	* @param {Object} context
	*/
	jQuery.fn.jplist.ui.controls.DatePickerFilter = function(context){
		return new Init(context);
	};	
	
	/**
	* static control registration
	*/
	jQuery.fn.jplist.controlTypes['date-picker-filter'] = {
		className: 'DatePickerFilter'
		,options: {}
	};	
})();

