;(function(){
	'use strict';		
		
	/**
	* Render control html
	* @param {Object} context
	*/
	var render = function(context){
		
		var options = {}
			,$prev
			,$next
			,prevDefaultDate
			,nextDefaultDate;
				
		//init prev and next input fields
		$prev = context.$control.find('[data-type="prev"]');
		$next = context.$control.find('[data-type="next"]');
		
		//init data
		context.$control.data('jplist-datepicker-range-prev', $prev);
		context.$control.data('jplist-datepicker-range-next', $next);
		
		//init empty onchacnge
		$prev.off('change').change(function(){
		
			if(jQuery.trim(jQuery(this).val()) === ''){
				context.history.addStatus(getStatus(context, false));
				context.observer.trigger(context.observer.events.unknownStatusesChanged, [false]);
			}
		});
		
		$next.off('change').change(function(){
		
			if(jQuery.trim(jQuery(this).val()) === ''){
				context.history.addStatus(getStatus(context, false));
				context.observer.trigger(context.observer.events.unknownStatusesChanged, [false]);
			}
		});
		
		//init options
        options['onSelect'] = function(dateText, inst){
			context.history.addStatus(getStatus(context, false));
			context.observer.trigger(context.observer.events.unknownStatusesChanged, [false]);
		};
				
		//start prev datepicker
		context.params.datepickerFunc($prev, options);
		
		//start next datepicker	
		context.params.datepickerFunc($next, options);
		
		prevDefaultDate = $prev.attr('value');
		
		if(prevDefaultDate){
			$prev['datepicker']('setDate', prevDefaultDate);
		}
		
		nextDefaultDate = $next.attr('value');
		
		if(nextDefaultDate){
			$next['datepicker']('setDate', nextDefaultDate);
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
			,data = null
			,prevDate = null
			,nextDate = null
			,dateTimeFormat
			,$prev
			,$next
			,dataPath;	
					
		//get vars
		dataPath = context.$control.attr('data-path').toString();
		dateTimeFormat = context.$control.attr('data-datetime-format').toString();
		
		//get prev/next controls
		$prev = context.$control.data('jplist-datepicker-range-prev');
		$next = context.$control.data('jplist-datepicker-range-next');
		
		//get dates from datepickers
		prevDate = $prev['datepicker']('getDate');
		nextDate = $next['datepicker']('getDate');
		
		data = new jQuery.fn.jplist.ui.controls.DatePickerRangeFilterDTO(dataPath, dateTimeFormat, prevDate, nextDate);		
		
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
				
				if(jQuery.isNumeric(status.data.prev_year) && jQuery.isNumeric(status.data.prev_month) && jQuery.isNumeric(status.data.prev_day)){
					
					//init deep link
					deepLink += context.name + context.options.delimiter0 + 'prev=' + status.data.prev_year + context.options.delimiter2 + status.data.prev_month + context.options.delimiter2 + status.data.prev_day;
				}
				
				if(jQuery.isNumeric(status.data.next_year) && jQuery.isNumeric(status.data.next_month) && jQuery.isNumeric(status.data.next_day)){
					
					if(deepLink !== ''){
						deepLink += context.options.delimiter1;
					}
					
					//init deep link
					deepLink += context.name + context.options.delimiter0 + 'next=' + status.data.next_year + context.options.delimiter2 + status.data.next_month + context.options.delimiter2 + status.data.next_day;
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
			
				switch(propName){
					
					case 'prev':{	
						
						sections = propValue.split(context.options.delimiter2);
						
						if(sections.length === 3){
						
							status.data.prev_year = sections[0];
							status.data.prev_month = sections[1];
							status.data.prev_day = sections[2];
							
							delete status.data.next_year;
							delete status.data.next_month;
							delete status.data.next_day;
						}
					}
					break;
					
					case 'next':{
						
						sections = propValue.split(context.options.delimiter2);
						
						if(sections.length === 3){
						
							status.data.next_year = sections[0];
							status.data.next_month = sections[1];
							status.data.next_day = sections[2];
							
							delete status.data.prev_year;
							delete status.data.prev_month;
							delete status.data.prev_day;
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
			,path;
		
		//init vars
		jqPath = context.$control.attr('data-path').toString();
		
		//init path
		if(jqPath){
		   
			path = new jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel(jqPath, 'datetime');
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
				
		var prevDate
			,nextDate
			,$prev
			,$next;
		
		//get prev/next controls
		$prev = context.$control.data('jplist-datepicker-range-prev');
		$next = context.$control.data('jplist-datepicker-range-next');
		
		if(jQuery.isNumeric(status.data.prev_year) && 
			jQuery.isNumeric(status.data.prev_month) && 
			jQuery.isNumeric(status.data.prev_day)){
		
			//init dates
			prevDate = new Date(status.data.prev_year, status.data.prev_month, status.data.prev_day);	
			$prev['datepicker']('setDate', prevDate);
		}
		else{
			$prev.val('');
		}
		
		if(jQuery.isNumeric(status.data.next_year) && 
			jQuery.isNumeric(status.data.next_month) && 
			jQuery.isNumeric(status.data.next_day)){
			
			nextDate = new Date(status.data.next_year, status.data.next_month, status.data.next_day);
			$next['datepicker']('setDate', nextDate);
		}
		else{				
			$next.val('');
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
	* jQUery UI date picker range filter
	* @constructor
	* @param {Object} context
	*/
	var Init = function(context){
				
		context.params = {
			datepickerFunc: function(){}
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
	* jQuery UI date pciker range filter controller
	* @constructor
	* @param {Object} context
	*/
	jQuery.fn.jplist.ui.controls.DatePickerRangeFilter = function(context){
		return new Init(context);
	};	
	
	/**
	* static control registration
	*/
	jQuery.fn.jplist.controlTypes['date-picker-range-filter'] = {
		className: 'DatePickerRangeFilter'
		,options: {}
	};	
})();

