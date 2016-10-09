(function(){
	'use strict';		
		
	/**
	* Get control status
	* @param {Object} context
	* @param {boolean} isDefault - if true, get default (initial) control status; else - get current control status
	* @return {jQuery.fn.jplist.StatusDTO}
	*/
	var getStatus = function(context, isDefault){
		
		var data
			,status
			,dataPath
			,value;	
				
		//init data-path
		dataPath = context.$control.attr('data-path');
				
		//init value
		if(isDefault){
			value = context.$control.attr('value') || '';
		}
		else{
			value = /** @type{string} */ (context.$control.val());
		}		
				
		//create status related data object
		data = new jQuery.fn.jplist.controls.TextboxDTO(
            dataPath
            ,value
            ,context.params.ignore
            ,context.params.mode
            ,context.params.not
            ,context.params.and
            ,context.params.or
        );
				
		//create status object
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
			,isDefault = false;
		
		if(context.inDeepLinking){
		
			//get status
			status = getStatus(context, isDefault);
			
			if(status.data){
				
				if(jQuery.trim(status.data.value) !== ''){
					
					//init deep link
					deepLink = context.name + context.options.delimiter0 + 'value=' + status.data.value;
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
	* @return {jQuery.fn.jplist.StatusDTO}
	*/
	var getStatusByDeepLink = function(context, propName, propValue){
		
		var isDefault = true
			,status = null;
		
		if(context.inDeepLinking){
		
			//get status
			status = getStatus(context, isDefault);
			
			if(status.data && (propName === 'value')){
			
				//set current page
				status.data.value = propValue;
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
	
		var dataType = null
			,path;
		
		path = new jQuery.fn.jplist.PathModel(context.params.path, dataType);
		
		paths.push(path);
	};
		
	/**
	* Set control status
	* @param {Object} context
	* @param {jQuery.fn.jplist.StatusDTO} status
	* @param {boolean} restoredFromStorage - is status restored from storage
	*/
	var setStatus = function(context, status, restoredFromStorage){
		
		if(status.data){

			if(!status.data.value){
				status.data.value = '';
			}

			//set value
            if(context.$control.val() !== status.data.value) {
                context.$control.val(status.data.value);
            }
		}
	};

    /**
     * handle typing
     * @param {Object} context
     */
    var handleTyping = function(context){

        if(context.params.typingStart && context.params.typingEnd) {

            if (context.params.isTyping) {
                window.clearTimeout(context.params.typingHandler);
            }
            else {
                context.params.isTyping = true;
                context.params.typingStart();
            }

            context.params.typingHandler = window.setTimeout(function () {

                context.params.isTyping = false;
                context.params.typingEnd();

            }, context.params.typingDelay);
        }
    };

    /**
     * send event
     * @param {Object} context
     */
    var sendEvent = function(context){

        var status = getStatus(context, false);

        context.observer.trigger(context.observer.events.knownStatusesChanged, [[status]]);
    };

	/**
	* Init control events
	* @param {Object} context
	*/
	var initEvents = function(context){
		
		if(context.params.$button && context.params.$button.length > 0){
			
			context.params.$button.on('click', function(e){
				
				e.preventDefault();

                //send event
                sendEvent(context);

				return false;
			});
		}
		else{
						
			context.$control.on(context.params.eventName, function(){

                //send event
                sendEvent(context);

                //handle typing
                handleTyping(context);
			});
		}

        if(context.params.$clear.length > 0){

            context.params.$clear.on('click', function(e){

                e.preventDefault();

                context.$control.val('');

                //send event
                sendEvent(context);
            });
        }
	};

    /**
     * init user defined functions
     */
    var initUserDefinedFunctions = function(context){

        var typingStart = context.$control.attr('data-typing-start')
            ,typingEnd = context.$control.attr('data-typing-end');

        if(jQuery.isFunction(jQuery.fn.jplist.settings[typingStart])){
            context.params.typingStart = jQuery.fn.jplist.settings[typingStart];
        }

        if(jQuery.isFunction(jQuery.fn.jplist.settings[typingEnd])){
            context.params.typingEnd = jQuery.fn.jplist.settings[typingEnd];
        }
    };

	/** 
	* Textbox control - used as text filter
	* @constructor
	* @param {Object} context
	*/
	var Init = function(context){

		context.params = {

			path: context.$control.attr('data-path')
			,dataButton: context.$control.attr('data-button')
			,eventName: context.$control.attr('data-event-name') || 'keyup'
			,$button: null
            ,$clear: context.$control.next('[data-type="clear"]')
            ,ignore: context.$control.attr('data-ignore')
            ,mode: context.$control.attr('data-mode') || 'contains'

            //typing
            ,typingDelay: Number(context.$control.attr('data-typing-delay')) || 400
            ,isTyping: false
            ,typingHandler: null
            ,typingStart: null
            ,typingEnd: null
		};

        if(context.params.mode === 'advanced'){

            context.params.or = jQuery.fn.jplist.ControlFactory.getProp(context.$control, 'or');
            context.params.and = jQuery.fn.jplist.ControlFactory.getProp(context.$control, 'and');
            context.params.not = jQuery.fn.jplist.ControlFactory.getProp(context.$control, 'not');
        }
        else{
            context.params.ignore = context.params.ignore || '[~!@#$%^&*()+=`\'"\/\\_]+' //[^a-zA-Z0-9]+ not letters/numbers: [~!@#$%^&*\(\)+=`\'"\/\\_]+
        }

        //init user defined functions
        initUserDefinedFunctions(context);

            //set initial value
		context.$control.val(context.$control.attr('value') || '');
		
		if(context.params.dataButton){
		
			//init filter button
			context.params.$button = jQuery(context.params.dataButton);
		}
		
		//init events
		initEvents(context);
		
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
	* Textbox control - used as text filter
	* @constructor
	* @param {Object} context	
	*/
	jQuery.fn.jplist.controls.Textbox = function(context){
		return new Init(context);
	};	
	
	/**
	* static control registration
	*/
	jQuery.fn.jplist.controlTypes['textbox'] = {
		className: 'Textbox'
		,options: {}
	};	
})();

