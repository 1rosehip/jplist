(function(){ //+
	'use strict';		
	
	/**
	* Init control events
	* @param {Object} context
	*/
	var initEvents = function(context){	
		
		/**
		* show preloader on render statuses event
		*/
		context.observer.on(context.observer.events.renderStatusesEvent, function(e){
			
			//show preloader
			context.$control.removeClass('jplist-hide-preloader');
		});
		
		/**
		* hide preloader on html render event
		*/
		context.observer.on(context.observer.events.setStatusesEvent, function(event, obj, statuses){
			
			//show preloader
			context.$control.addClass('jplist-hide-preloader');
		});
	};
	
	/** 
	* Dropdown control: sort dropdown, filter dropdown, paging dropdown etc.
	* @constructor
	* @param {Object} context
	*/
	var Init = function(context){
		
		//init events
		initEvents(context);
		
		return jQuery.extend(this, context);
	};

	/** 
	* Preloader control - used for PHP, ASP.NET etc. data sources
	* @constructor
	* @param {Object} context
	*/
	jQuery.fn.jplist.ui.controls.Preloader = function(context){
		return new Init(context);
	};	
		
	/**
	* static control registration
	*/
	jQuery.fn.jplist.controlTypes['preloader'] = {
		className: 'Preloader'
		,options: {}
	};
})();

