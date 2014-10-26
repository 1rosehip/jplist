(function(){
	'use strict';		
	
	/**
	* get item control properties
	* @param {Object} context
	* @param {jQueryObject} $control
	* @return {Object}
	*/
	var getItemControlProperties = function(context, $control){
		
		var type			
			,itemControlType
			,controlTypeClass = null
			,controlOptions = null;
		
		//get control type		
		type = $control.attr('data-control-type');		
				
		itemControlType = {};
		
		if(jQuery.fn.jplist.itemControlTypes[type]){
			itemControlType = jQuery.extend(true, {}, itemControlType, jQuery.fn.jplist.itemControlTypes[type]);
		}
		
		if(context.options.itemControlTypes && context.options.itemControlTypes[type]){
			itemControlType = jQuery.extend(true, {}, itemControlType, context.options.itemControlTypes[type]);
		}
		
		//init control vars
		//itemControlType = (context.options.itemControlTypes && context.options.itemControlTypes[type]) || jQuery.fn.jplist.itemControlTypes[type];
		
		if(itemControlType){
		
			//get control type class
			if(itemControlType['className']){				
				controlTypeClass = jQuery.fn.jplist.ui.itemControls[itemControlType['className']];		
			}
			
			//get options
			if(itemControlType['options']){
				controlOptions = itemControlType['options'];
			}
		}
		
		return {			
			type: type
			,itemControlType: itemControlType
			,controlTypeClass: controlTypeClass
			,controlOptions: controlOptions
		};
	};
	
	/**
	* create item control
	* @param {Object} context
	* @param {jQueryObject} $control
	* @return {Object}
	*/
	var create = function(context, $control){
		
		var control = null
			,properties;
				
		//init control model
		properties = getItemControlProperties(context, $control);
		
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
		}

		return control;		
	};
	
	/** 
	* Item Control Factory
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
	* create item control
	* @param {jQueryObject} $control
	*/
	Init.prototype.create = function($control){
		return create(this, $control);
	};
	
	/**
	* Item Control Factory
	* @param {Object} options
	* @param {Object} observer
	* @param {jQuery.fn.jplist.app.History} history
	* @param {jQueryObject} $root - jplist jquery element
	* @constructor
	*/
	jQuery.fn.jplist.ui.list.ItemControlFactory = function(options, observer, history, $root){		
		return new Init(options, observer, history, $root);		
	};
})();

