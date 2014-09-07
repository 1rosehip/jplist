/**
* jPList - jQuery Data Grid Controls ##VERSION## - http://jplist.com 
* Copyright 2014 Miriam Zusin. All rights reserved.
* For non-commercial, personal, or open source projects and applications, you may use jPList for free  http://www.binpress.com/license/read/id/2749/app/2085
* If your project generates any type of income, e.g. sells products, ads, services or just represents a commercial company, you should get a commercial license at http://www.binpress.com
*/
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

