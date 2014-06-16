/**
* jPList - jQuery Data Grid Controls ##VERSION## - http://jplist.com 
* Copyright 2014 Miriam Zusin. All rights reserved.
* For non-commercial, personal, or open source projects and applications, you may use jPList for free under the terms of the GPL V3 License (https://gnu.org/licenses/gpl.html)
* If your project generates any type of income, e.g. sells products, ads, services or just represents a commercial company, you should get a commercial license at http://www.binpress.com
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

