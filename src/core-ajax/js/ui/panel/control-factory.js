/**
 * control factory
 * \core\js\ui\panel\control-factory.js
 */
;(function(){
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
		
		if(controlType){
		
			//get control type class
			if(controlType['className']){				
				controlTypeClass = jQuery.fn.jplist.controls[controlType['className']];
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
	 * @param {jQuery.fn.jplist.ControlsCollection} controlsCollection
	 * @return {Object}
	 */
	var create = function(context, $control, controlsCollection){
		
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
			,controlsCollection: controlsCollection
		});
				
		if(properties.controlTypeClass && jQuery.isFunction(properties.controlTypeClass)){
			
			//init control
			control = new properties.controlTypeClass(properties);
		}

		return control;		
	};
	
	/**
	 * Control Factory
	 * @param {Object} options
	 * @param {Object} observer
	 * @param {jQuery.fn.jplist.History} history
	 * @param {jQueryObject} $root - jplist jquery element
	 * @constructor
	 */
	jQuery.fn.jplist.ControlFactory = function(options, observer, history, $root){
	
		this.options = options;
		this.observer = observer;
		this.history = history;
		this.$root = $root;
	};
	
	/**
	 * create control
	 * @param {jQueryObject} $control
	 * @param {jQuery.fn.jplist.ControlsCollection} controlsCollection
     * @return {Object}
	 */
	jQuery.fn.jplist.ControlFactory.prototype.create = function($control, controlsCollection){
		return create(this, $control, controlsCollection);
	};
	
	/**
	 * Get control status
	 * @interface
	 * @param {boolean} isDefault - if true, get default (initial) control status; else - get current control status
	 * @return {jQuery.fn.jplist.StatusDTO}
	 */
	jQuery.fn.jplist.ControlFactory.prototype.getStatus = function(isDefault){
		return null;
	};
	
	/**
	 * Set control status
	 * @interface
	 * @param {jQuery.fn.jplist.StatusDTO} status
	 * @param {boolean} restoredFromStorage - is status restored from storage
	 */
	jQuery.fn.jplist.ControlFactory.prototype.setStatus = function(status, restoredFromStorage){};
	
	/**
	 * Get deep link
	 * @interface
	 * @return {string} deep link
	 */
	jQuery.fn.jplist.ControlFactory.prototype.getDeepLink = function(){
		return '';
	};
	
	/**
	 * get status by deep link
	 * @interface
	 * @param {string} propName - deep link property name
	 * @param {string} propValue - deep link property value
	 * @return {jQuery.fn.jplist.StatusDTO}
	 */
	jQuery.fn.jplist.ControlFactory.prototype.getStatusByDeepLink = function(propName, propValue){
		return null;
	};
	
	/**
	 * Get control paths
	 * @interface
	 * @param {Array.<jQuery.fn.jplist.PathModel>} paths
	 */
	jQuery.fn.jplist.ControlFactory.prototype.getPaths = function(paths){
		return [];
	};
	
	/**
	 * set statuses by deep links
	 * @interface
	 * @param {Array.<Object>} params - array of params {controlName: '...', propName: '...', propValue: '...'}
	 */
	jQuery.fn.jplist.ControlFactory.prototype.setByDeepLink = function(params){};

    /**
     * loops through data attributes of the $control and searches for data-prop, data-prop1, data-prop2
     * if found only 1 data attribute -> returns it's value as string
     * otherwise returns array of values
     * static control helper
     * @static
     * @param {jQueryObject} $control
     * @param {string} prop - data attribute property name
     * @return {Array.<string>|string}
     */
    jQuery.fn.jplist.ControlFactory.getProp = function($control, prop){

        var values = []
            ,regex = new RegExp('^' + prop + '[0-9]*$');

        jQuery.each($control.data(), function(key, value) {

            if(regex.test(key)){
                values.push(value);
            }
        });

        if(values.length == 0){
            return "";
        }

        if(values.length == 1){
            return values[0];
        }

        return values;
    };

    /**
     * returns string like [data-prop="..."][data-prop1=""][data-prop2=""]
     * static control helper
     * @static
     * @param {Array.<string>|string} property values
     * @param {string} prop - data attribute property name
     * @return {Array.<string>|string} path
     */
    jQuery.fn.jplist.ControlFactory.getPropPath = function(values, prop){

        var path = '';

        if(jQuery.isArray(values)){

            for(var i=0; i<values.length; i++){

                var prefix = '';

                if(i !== 0){
                    prefix = '' + i;
                }

                path += '[data-' + prop + prefix + '="' + values[i] + '"]';
            }
        }
        else{
            path += '[data-' + prop + '="' + values + '"]';
        }

        return path;
    };
})();

/*
	$control
	$root
	
	action
	name
	type
	
	controlOptions	- control properties
	controlType	- control properties
	
	inAnimation
	inDeepLinking
	inStorage
	isAnimateToTop
	
	observer
	options - user options	
	paths - empty ??
	history	
	
	params - control specific properties
*/

