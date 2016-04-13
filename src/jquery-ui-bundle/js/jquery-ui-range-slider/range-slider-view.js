;(function(){//+
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
			,min, max, prev, next;
				
		//init vars	
		min = context.params.$uiSlider['slider']('option', 'min');
		max = context.params.$uiSlider['slider']('option', 'max');		
		
		
		if(isDefault){
			prev = context.params.defaultPrev;
			next = context.params.defaultNext;
		}
		else{
			prev = context.params.$uiSlider['slider']('values', 0);
			next = context.params.$uiSlider['slider']('values', 1);
		}
		
		//init range slider data transfer object
		data = new jQuery.fn.jplist.ui.controls.RangeSliderDTO(context.params.dataPath, min, max, prev, next);	
		
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
			
			if(status.data && jQuery.isNumeric(status.data.prev) && jQuery.isNumeric(status.data.next)){
				
				//init deep link
				deepLink = context.name + 
							context.options.delimiter0 + 'prev' + 
							context.options.delimiter2 + 'next=' + 
							status.data.prev + context.options.delimiter2 + status.data.next;
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
			
			if(status.data && (propName === 'prev' + context.options.delimiter2 + 'next')){
			
				sections = propValue.split(context.options.delimiter2);
				
				if(sections.length === 2){
					
					status.data.prev = sections[0];
					status.data.next = sections[1];
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
		   
			path = new jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel(context.params.dataPath, 'number');
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
				
		var prev
			,next;
										
		if(jQuery.isNumeric(status.data.prev) && jQuery.isNumeric(status.data.next)){
			
			//get values
			prev = Number(status.data.prev);
			next = Number(status.data.next);			
			
			if(!isNaN(prev) && !isNaN(next)){	
				
				if(context.params.$uiSlider['slider']('values', 0) != prev){
					context.params.$uiSlider['slider']('values', 0, prev);
				}
				
				if(context.params.$uiSlider['slider']('values', 1) != next){
					context.params.$uiSlider['slider']('values', 1, next);
				}
			}
		}

		if(context.params.controlOptions){				
			context.params.uiSetValuesFunc(context.params.$uiSlider, context.params.$prev, context.params.$next);
		}
	};
	
	/**
	* Init control events
	* @param {Object} context
	*/
	var initEvents = function(context){
				
		//on value change
		context.params.$uiSlider.on('slidechange', function(event, ui) {
			
			//add status to the history object	
			context.history.addStatus(getStatus(context, false));
			
			//force render statuses event
			context.observer.trigger(context.observer.events.unknownStatusesChanged, [false]);
		});
	};
	
	/**
	* init user defined functions
	*/
	var initUserDefinedFunctions = function(context){
		
		var sliderFunc = context.$control.attr('data-slider-func')
			,setValuesFunc = context.$control.attr('data-setvalues-func');
	
		if(jQuery.isFunction(jQuery.fn.jplist.settings[sliderFunc])){
			context.params.uiSliderFunc = jQuery.fn.jplist.settings[sliderFunc];
		}
			
		if(jQuery.isFunction(jQuery.fn.jplist.settings[setValuesFunc])){
			context.params.uiSetValuesFunc = jQuery.fn.jplist.settings[setValuesFunc];
		}
	};
	
	/** 
	* Dropdown control: sort dropdown, filter dropdown, paging dropdown etc.
	* @constructor
	* @param {Object} context
	*/
	var Init = function(context){
			
		context.params = {
			$uiSlider: context.$control.find('[data-type="ui-slider"]')
			,$prev: context.$control.find('[data-type="prev-value"]')
			,$next: context.$control.find('[data-type="next-value"]')
			,uiSliderFunc: function($uiSlider, $prev, $next){}
			,uiSetValuesFunc: function($uiSlider, $prev, $next){}
			,controlOptions: context['controlOptions']
			,dataPath: context.$control.attr('data-path')
		};
		
		//set user defined functions
		initUserDefinedFunctions(context);
				
		//call ui slider functions
		context.params.uiSliderFunc(context.params.$uiSlider, context.params.$prev, context.params.$next);			
		context.params.uiSetValuesFunc(context.params.$uiSlider, context.params.$prev, context.params.$next);
		
		//save default prev / next values
		context.params.defaultPrev = context.params.$uiSlider['slider']('values', 0);
		context.params.defaultNext = context.params.$uiSlider['slider']('values', 1);
		
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
	* jQuery UI Range slider controller
	* @constructor
	* @param {Object} context
	*/
	jQuery.fn.jplist.ui.controls.RangeSlider = function(context){
		return new Init(context);
	};	
		
	/**
	* static control registration
	*/
	jQuery.fn.jplist.controlTypes['range-slider'] = {
		className: 'RangeSlider'
		,options: {}
	};	
})();

