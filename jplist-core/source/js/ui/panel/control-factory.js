(function(){
	'use strict';		
	
	/**
	* get control properties
	* @param {Object} context
	* @param {jQueryObject} $control
	* @return {Object}
	*/
	var getControlProperties = function(context, $control){
		
		var temp
			,type
			,inDeepLinking
			,inStorage
			,inAnimation
			,isAnimateToTop
			,controlType
			,controlTypeClass
			,controlOptions;
		
		type = $control.attr('data-control-type');
		inDeepLinking = true; //by default deep linking is enabled for the given control
		inStorage = true; //by default control is stored in storage (if storage are enabled)
		inAnimation = true; //by default control is used in animations
		isAnimateToTop = false; //by default "animate to top" is disabled
			
		controlType = null;
		controlTypeClass = null;
		controlOptions = null;
		
		//by default deep linking is enabled for the given control
		//if data-control-deep-link="false" - control is excluded from deep link
		temp = $control.attr('data-control-deep-link');
		if(temp && temp.toString() === 'false'){
			inDeepLinking = false;
		}
		
		//by default control is stored in storage (if storage is enabled)
		//if data-control-storage="false" - control is excluded from storage
		temp = $control.attr('data-control-storage');
		if(temp && temp.toString() === 'false'){
			inStorage = false;
		}
		
		//by default control is used in animation
		//if data-control-animation="false" - control is excluded from animation
		temp = $control.attr('data-control-animation');
		if(temp && temp.toString() === 'false'){
			inAnimation = false;
		}
		
		//by "animate to top" is disabled
		//if data-control-animate-to-top="true" - "animate to top" is enabled
		temp = $control.attr('data-control-animate-to-top');
		if(temp && temp.toString() === 'true'){
			isAnimateToTop = true;
		}
		
		//init control vars
		controlType = {};
		
		if(jQuery.fn.jplist.controlTypes[type]){
			controlType = jQuery.extend(true, {}, controlType, jQuery.fn.jplist.controlTypes[type]);
		}
		
		if(context.options.controlTypes && context.options.controlTypes[type]){
			controlType = jQuery.extend(true, {}, controlType, context.options.controlTypes[type]);
		}		
		
		//controlType = (context.options.controlTypes && context.options.controlTypes[type]) || jQuery.fn.jplist.controlTypes[type];
		
		if(controlType){
		
			//get control type class
			if(controlType['className']){				
				controlTypeClass = jQuery.fn.jplist.ui.controls[controlType['className']];				
			}
			
			//get options
			if(controlType['options']){
				controlOptions = controlType['options'];
			}
		}
		
		return {			
			type: type
			,action: $control.attr('data-control-action')
			,name: $control.attr('data-control-name')
			,inDeepLinking: inDeepLinking
			,inStorage: inStorage
			,inAnimation: inAnimation
			,isAnimateToTop: isAnimateToTop
				
			,controlType: controlType
			,controlTypeClass: controlTypeClass
			,controlOptions: controlOptions
			
			,paths: []
		};
	};
	
	/**
	* create control
	* @param {Object} context
	* @param {jQueryObject} $control
	* @return {Object}
	*/
	var create = function(context, $control){
		
		var control = null
			,properties;
		
		//init control model
		properties = getControlProperties(context, $control);
		
		//add more properties :)
		properties = jQuery.extend(true, properties, {			
			$control: $control
			,history: context.history
			,observer: context.observer
			,options: context.options
			,$root: context.$root
		});
				
		if(properties.controlTypeClass && jQuery.isFunction(properties.controlTypeClass)){
			
			//init control
			control = new properties.controlTypeClass(properties);
			
			//interface
			/*
			...prototype.getStatus = function(){};
			...prototype.getDeepLink = function(){};
			...prototype.getStatusByDeepLink = function(){};
			...prototype.setByDeepLink = function(){};
			...prototype.getPaths = function(){};
			...prototype.setStatus = function(){};
			*/
		}

		return control;		
	};
	
	/** 
	* Control Factory
	* @constructor
	* @param {Object} options
	* @param {Object} observer
	* @param {jQuery.fn.jplist.app.History} history
	* @param {jQueryObject} $root - jplist jquery element
	*/
	var Init = function(options, observer, history, $root){
		
		var context = {
			options: options
			,observer: observer
			,history: history
			,$root: $root
		};
				
		return jQuery.extend(this, context);
	};
	
	/**
	* create control
	* @param {jQueryObject} $control
	*/
	Init.prototype.create = function($control){
		return create(this, $control);
	};
	
	/**
	* Control Factory
	* @param {Object} options
	* @param {Object} observer
	* @param {jQuery.fn.jplist.app.History} history
	* @param {jQueryObject} $root - jplist jquery element
	* @constructor
	*/
	jQuery.fn.jplist.ui.panel.ControlFactory = function(options, observer, history, $root){		
		return new Init(options, observer, history, $root);		
	};
})();

