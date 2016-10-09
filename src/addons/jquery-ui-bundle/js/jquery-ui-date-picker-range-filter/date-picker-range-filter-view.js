;(function(){
	'use strict';		
		
	/**
	 * Render control html
	 * @param {Object} context
	 */
	var render = function(context){
		
		var options = {}
			,prevDefaultDate
			,nextDefaultDate;

		//init empty onchacnge
		context.params.$prev.off('change').change(function(){
		
            var status;
            
			if(jQuery.trim(jQuery(this).val()) === ''){
                
                status = getStatus(context, false);

				context.observer.trigger(context.observer.events.knownStatusesChanged, [[status]]);
			}
		});

        context.params.$next.off('change').change(function(){
		
            var status;
            
			if(jQuery.trim(jQuery(this).val()) === ''){
                
                status = getStatus(context, false);

				context.observer.trigger(context.observer.events.knownStatusesChanged, [[status]]);
			}
		});
		
		//init options
        options['onSelect'] = function(dateText, inst){
            
            var status = getStatus(context, false);

			context.observer.trigger(context.observer.events.knownStatusesChanged, [[status]]);
		};
				
		//start prev datepicker
		context.params.datepickerFunc(context.params.$prev, options);
		
		//start next datepicker	
		context.params.datepickerFunc(context.params.$next, options);
		
		prevDefaultDate = context.params.$prev.attr('value');
		
		if(prevDefaultDate){
            context.params.$prev['datepicker']('setDate', prevDefaultDate);
		}
		
		nextDefaultDate = context.params.$next.attr('value');
		
		if(nextDefaultDate){
            context.params.$next['datepicker']('setDate', nextDefaultDate);
		}
	};
	
	/**
	 * Get control status
	 * @param {Object} context
	 * @param {boolean} isDefault - if true, get default (initial) control status; else - get current control status
	 * @return {jQuery.fn.jplist.StatusDTO}
	 */
	var getStatus = function(context, isDefault){

		var status = null
			,data = null
			,prevDate = null
			,nextDate = null
			,dataPath;	
					
		//get vars
		dataPath = context.$control.attr('data-path').toString();

        if(isDefault){
            prevDate = context.params.defaultPrev;
            nextDate = context.params.defaultNext;
        }
        else{
            //get dates from datepickers
            prevDate = context.params.$prev['datepicker']('getDate');
            nextDate = context.params.$next['datepicker']('getDate');
        }
		
		data = new jQuery.fn.jplist.controls.DatePickerRangeFilterDTO(dataPath, context.params.dateTimeFormat, prevDate, nextDate);
		
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
	 * Get deep link
	 * @param {Object} context
	 * @return {string} deep link
	 */
	var getDeepLink = function(context){
		
		var deepLink = ''
			,status
			,isDefault = false
			,isPrev
			,isNext;
		
		if(context.inDeepLinking){
		
			//get status
			status = getStatus(context, isDefault);
			
			if(status.data){
				
				isPrev = jQuery.isNumeric(status.data.prev_year) && 
						 jQuery.isNumeric(status.data.prev_month) && 
						 jQuery.isNumeric(status.data.prev_day);
						 
				isNext = jQuery.isNumeric(status.data.next_year) && 
						 jQuery.isNumeric(status.data.next_month) && 
						 jQuery.isNumeric(status.data.next_day);
						 
				if(isPrev || isNext){
				
					//date-picker-range-filter:prev~next=2013~11~1!2015~10~4
					deepLink += context.name + context.options.delimiter0;
					
					if(isPrev){
						deepLink += 'prev';
					}
					
					if(isNext){
					
						if(isPrev){
							//added ~
							deepLink += context.options.delimiter2;
						}
						
						deepLink += 'next';
					}
					
					//added =
					deepLink += '=';
					
					if(isPrev){
					
						//2013~11~1
						deepLink += status.data.prev_year + context.options.delimiter2 + 
									status.data.prev_month + context.options.delimiter2 + 
									status.data.prev_day;
					}
					
					if(isNext){
						
						if(isPrev){
							//added !
							deepLink += context.options.delimiter3;
						}
						
						//2015~10~4
						deepLink += status.data.next_year + context.options.delimiter2 + 
									status.data.next_month + context.options.delimiter2 + 
									status.data.next_day;
					}
				}
			}
		}
		
		return deepLink;
	};
	
	/**
	 * get prev value from deep link
	 * @param {Object} context
	 * @param {jQuery.fn.jplist.StatusDTO} status
	 * @param {string} propValue
	 */
	var getPrevValue = function(context, status, propValue){
		
		var sections;
		
		sections = propValue.split(context.options.delimiter2);
		
		if(sections.length === 3){
		
			status.data.prev_year = sections[0];
			status.data.prev_month = sections[1];
			status.data.prev_day = sections[2];			
		}
	};
	
	/**
	 * get next value from deep link
	 * @param {Object} context
	 * @param {jQuery.fn.jplist.StatusDTO} status
	 * @param {string} propValue
	 */
	var getNextValue = function(context, status, propValue){
		
		var sections;
		
		sections = propValue.split(context.options.delimiter2);
		
		if(sections.length === 3){
		
			status.data.next_year = sections[0];
			status.data.next_month = sections[1];
			status.data.next_day = sections[2];			
		}
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
		
			//get status
			status = getStatus(context, isDefault);
			
			delete status.data.next_year;
			delete status.data.next_month;
			delete status.data.next_day;
			delete status.data.prev_year;
			delete status.data.prev_month;
			delete status.data.prev_day;
			
			if(status.data){ //date-picker-range-filter:prev~next=2013~11~10!2015~10~3
				
				switch(propName){
					
					case 'prev':{	
						
						//value -> 2013~11~10
						getPrevValue(context, status, propValue);						
					}
					break;
					
					case 'next':{
						
						//value -> 2015~10~3
						getNextValue(context, status, propValue);
					}
					break;
					
					case 'prev~next':{
						
						//value -> 2013~11~10!2015~10~3
						sections = propValue.split(context.options.delimiter3);
						
						if(sections.length === 2){
						
							getPrevValue(context, status, sections[0]);
							getNextValue(context, status, sections[1]);
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
	 * @param {Array.<jQuery.fn.jplist.PathModel>} paths
	 */
	var getPaths = function(context, paths){
	
		var jqPath
			,path;
		
		//init vars
		jqPath = context.$control.attr('data-path').toString();
		
		//init path
		if(jqPath){
		   
			path = new jQuery.fn.jplist.PathModel(jqPath, 'datetime');
			paths.push(path);
		}	
	};
		
	/**
	 * Set control status
	 * @param {Object} context
	 * @param {jQuery.fn.jplist.StatusDTO} status
	 * @param {boolean} restoredFromStorage - is status restored from storage
	 */
	var setStatus = function(context, status, restoredFromStorage){

		var prevDate
			,nextDate;
		
		if(jQuery.isNumeric(status.data.prev_year) && 
			jQuery.isNumeric(status.data.prev_month) && 
			jQuery.isNumeric(status.data.prev_day)){
		
			//init dates
			prevDate = new Date(status.data.prev_year, status.data.prev_month, status.data.prev_day);
            context.params.$prev['datepicker']('setDate', prevDate);
		}
		else{
            context.params.$prev.val('');
		}
		
		if(jQuery.isNumeric(status.data.next_year) && 
			jQuery.isNumeric(status.data.next_month) && 
			jQuery.isNumeric(status.data.next_day)){
			
			nextDate = new Date(status.data.next_year, status.data.next_month, status.data.next_day);
            context.params.$next['datepicker']('setDate', nextDate);
		}
		else{
            context.params.$next.val('');
		}
	};
	
	/**
	 * init user defined functions
     * @param {Object} context
	 */
	var initUserDefinedFunctions = function(context){
		
		var datePickerFunc = context.$control.attr('data-datepicker-func');
	
		if(jQuery.isFunction(jQuery.fn.jplist.settings[datePickerFunc])){
			context.params.datepickerFunc = jQuery.fn.jplist.settings[datePickerFunc];
		}
	};

    /**
     * get default date value
     * @param {Object} context
     * @param {string} dateValue
     * @return {Date}
     */
    var getDefaultDate = function(context, dateValue){

        var date = null;

        if(dateValue){

            if(dateValue === 'today'){

                date = new Date();
            }
            else{
                date = jQuery.fn.jplist.HelperService.formatDateTime(dateValue, context.params.dateTimeFormat);
            }
        }

        return date;
    };

	/** 
	 * jQUery UI date picker range filter
	 * @constructor
	 * @param {Object} context
	 */
	var Init = function(context){
				
		context.params = {
			datepickerFunc: function(){}
            ,$prev: context.$control.find('[data-type="prev"]')
            ,$next: context.$control.find('[data-type="next"]')
            ,dateTimeFormat: context.$control.attr('data-datetime-format').toString()
		};

        //save default prev / next values
        context.params.defaultPrev = context.params.$prev['datepicker']('getDate');

        if(!context.params.defaultPrev){
            context.params.defaultPrev = getDefaultDate(context, context.params.$prev.attr('value'));
        };

        context.params.defaultNext = context.params.$next['datepicker']('getDate');

        if(!context.params.defaultNext){
            context.params.defaultNext = getDefaultDate(context, context.params.$next.attr('value'));
        }
		
		//set user defined functions
		initUserDefinedFunctions(context);
		
		//render control
		render(context);
		
		return jQuery.extend(this, context);
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
	 * Get Paths
	 * @param {Array.<jQuery.fn.jplist.PathModel>} paths
	 */
	Init.prototype.getPaths = function(paths){
		getPaths(this, paths);
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
	 * jQuery UI date pciker range filter controller
	 * @constructor
	 * @param {Object} context
	 */
	jQuery.fn.jplist.controls.DatePickerRangeFilter = function(context){
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

