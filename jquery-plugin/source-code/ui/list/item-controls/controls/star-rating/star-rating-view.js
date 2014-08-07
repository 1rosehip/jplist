/**
* jPList - jQuery Data Grid Controls ##VERSION## - http://jplist.com 
* Copyright 2014 Miriam Zusin. All rights reserved.
* For non-commercial, personal, or open source projects and applications, you may use jPList for free  http://www.binpress.com/license/read/id/2749/app/2085
* If your project generates any type of income, e.g. sells products, ads, services or just represents a commercial company, you should get a commercial license at http://www.binpress.com
*/
(function(){//+
	'use strict';		
	
	/**
	* render control
	* @param {Object} context
	*/
	var render = function(context){
		
		var html = '';
		
		if(context.controlOptions && jQuery.isFunction(context.controlOptions.render)){
			
			//render html
			html = context.controlOptions.render({
				total: context.params.total
				,rating: context.params.rating
				,one: context.params.total === 1
				,percent: context.params.rating*100/5
			});
			
			//paste html
			context.$control.html(html);
		}
	};
	
	/** 
	* Star Rating Item Control View
	* @constructor
	* @param {Object} context
	*/
	var Init = function(context){
				
		context.params = {
			total: Number(context.$control.attr('data-total')) || 0
			,rating: Number(context.$control.attr('data-rating')) || 0
		};
				
		if(context.params.total <= 0){
			
			//hide control if no reviews
			context.$control.addClass('jplist-hidden');
		}
		else{
			//render control html
			render(context);			
		}
				
		return jQuery.extend(this, context);
	};
	
	/** 
	* Star Rating Item Control View
	* @constructor
	* @param {Object} context
	*/
	jQuery.fn.jplist.ui.itemControls.StarRating = function(context){
		return new Init(context);
	};	
		
})();

