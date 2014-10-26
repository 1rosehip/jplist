/**
* jPList - jQuery Data Grid Controls ##VERSION## - http://jplist.com 
* Copyright 2014 Miriam Zusin. All rights reserved.
* For non-commercial, personal, or open source projects and applications, you may use jPList for free  http://www.binpress.com/license/read/id/2749/app/2085
* If your project generates any type of income, e.g. sells products, ads, services or just represents a commercial company, you should get a commercial license at http://www.binpress.com
*/
(function(){
	'use strict';		
	
	/** 
	* Button Text Filter Model
	* @constructor
	* @param {string} dataPath - data-path attribute
	* @param {string} value - button text filter data-text value
	* @param {string} ignore - ignore characters regex (defined in javascript in control's options)
	* @param {boolean} selected - if button is selected
	*/
	jQuery.fn.jplist.ui.controls.ButtonTextFilterDTO = function(dataPath, value, ignore, selected){
		
		return {
			path: dataPath		
			,ignore: ignore
			,value: value
			,selected: selected
			,filterType: 'TextFilter' //used in controller to define filter type
		};
	};	
		
})();

