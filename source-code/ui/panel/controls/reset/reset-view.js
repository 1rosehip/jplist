/**
* jQuery jPList Plugin ##VERSION## 
* Copyright 2014 Miriam Zusin. All rights reserved.
* To use this file you must buy a licence at http://codecanyon.net/user/no81no/portfolio 
*/
(function(){//+
	'use strict';		
	
	/**
	* Init control events
	* @param {Object} context
	*/
	var initEvents = function(context){
		
		context.$control.on('click', function(){
		
			//force build statuses event			
			context.observer.trigger(context.observer.events.forceRenderStatusesEvent, [true]);
		});
	};
	
	/** 
	* Reset control
	* @constructor
	* @param {Object} context
	*/
	var Init = function(context){
				
		//init events
		initEvents(context);
		
		return jQuery.extend(this, context);
	};
	
	/** 
	* Reset control
	* @constructor
	* @param {Object} context
	*/
	jQuery.fn.jplist.ui.controls.Reset = function(context){
		return new Init(context);
	};	
		
})();

