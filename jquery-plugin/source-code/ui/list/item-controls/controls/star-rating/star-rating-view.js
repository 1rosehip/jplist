/**
* jPList - jQuery Data Grid Controls ##VERSION## - http://jplist.com 
* Copyright 2014 Miriam Zusin. All rights reserved.
* For non-commercial, personal, or open source projects and applications, you may use jPList for free  http://www.binpress.com/license/read/id/2749/app/2085
* If your project generates any type of income, e.g. sells products, ads, services or just represents a commercial company, you should get a commercial license at http://www.binpress.com
*/
(function(){//+
	'use strict';		
	
	/** 
	* Star Rating Item Control View
	* @constructor
	* @param {Object} context
	*/
	var Init = function(context){
				
		context.params = {
			
		};
		
		//console.log('star rating');
				
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

