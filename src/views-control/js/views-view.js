(function(){//+
	'use strict';		
	
	/**
	* Get control status
	* @param {Object} context
	* @param {boolean} isDefault - if true, get default (initial) control status; else - get current control status
	* @return {jQuery.fn.jplist.app.dto.StatusDTO}
	*/
	var getStatus = function(context, isDefault){
		
		var data
			,status = null
			,view = context.params.defaultView;
					
		if(isDefault){
			view = context.params.defaultView;
		}
		else{
			view = context.params.currentView;
		}
		
		//create status related data
		data = new jQuery.fn.jplist.ui.controls.ViewsDTO(view);
		
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

			if(status.data){
				
				//init deep link
				deepLink = context.name + context.options.delimiter0 + 'view=' + status.data.view;
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
			,status = null;
		
		if(context.inDeepLinking){
		
			//get status
			status = getStatus(context, isDefault);
			
			//update status data with the view from deep link
			status.data.view = propValue;
		}
		
		return status;
	};
			
	/**
	* Set control status
	* @param {Object} context
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	* @param {boolean} restoredFromStorage - is status restored from storage
	*/
	var setStatus = function(context, status, restoredFromStorage){
				
		if(status.data){
		
			//remove old classes from the root element
			context.$root.removeClass(context.params.types.join(' '));
			
			if(!context.inStorage && restoredFromStorage){
				
				//restore default view
				context.$root.addClass(context.params.defaultView);				
				status.data.view = context.params.defaultView;
				
				//set current view
				context.params.currentView = context.params.defaultView;
				
				//force build statuses status event	
				context.observer.trigger(context.observer.events.statusChanged, [status]);
			}
			else{			
				context.$root.addClass(status.data.view);
				
				//set current view
				context.params.currentView = status.data.view;
			}			
		}
	};
	
	/**
	* Init control events
	* @param {Object} context
	*/
	var initEvents = function(context){	
			
		context.params.$buttons.on('click', function(){
			
			var viewType = jQuery(this).attr('data-type');
							
			//remove old classes from the root element
			context.$root.removeClass(context.params.types.join(' ')).addClass(viewType);
			
			//set current view
			context.params.currentView = viewType;
			
			//update last status
			context.history.addStatus(getStatus(context, false));
			
			//force build statuses event			
			context.observer.trigger(context.observer.events.unknownStatusesChanged, [false]);
		});
	};
	
	/** 
	* Views control (grid / list / thumbs view etc.)
	* @constructor
	* @param {Object} context
	*/
	var Init = function(context){
				
		context.params = {
			
			$buttons: context.$control.find('[data-type]')
			,defaultView: context.$control.attr('data-default') || 'list-view'
			,currentView: context.$control.attr('data-default') || 'list-view'
			,types: []
		};
		
		if(context.params.$buttons.length > 0){		
			
			//init types list
			context.params.$buttons.each(function(){
				
				var viewType = jQuery(this).attr('data-type');
				
				if(viewType){
					context.params.types.push(viewType);
				}
			});
			
			//init events
			initEvents(context);
		}
		
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
	* Set Status
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	* @param {boolean} restoredFromStorage - is status restored from storage
	*/
	Init.prototype.setStatus = function(status, restoredFromStorage){
		setStatus(this, status, restoredFromStorage);
	};
	
	/** 
	* Views control (grid / list / thumbs view etc.)
	* @constructor
	* @param {Object} context
	*/
	jQuery.fn.jplist.ui.controls.Views = function(context){
		return new Init(context);
	};	
	
	/**
	* static control registration
	*/
	jQuery.fn.jplist.controlTypes['views'] = {
		className: 'Views'
		,options: {}
	};	
})();

