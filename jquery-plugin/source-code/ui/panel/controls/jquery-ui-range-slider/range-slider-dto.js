/**
* jPList - jQuery Data Grid Controls ##VERSION## - http://jplist.com 
* Copyright 2014 Miriam Zusin. All rights reserved.
* For non-commercial, personal, or open source projects and applications, you may use jPList for free  http://www.binpress.com/license/read/id/2749/app/2085
* If your project generates any type of income, e.g. sells products, ads, services or just represents a commercial company, you should get a commercial license at http://www.binpress.com
*/
(function(){
	'use strict';		
	
	/** 
	* jQuery UI Range slider
	* @constructor
	* @param {string} dataPath - RangeSlider data-path attribute
	* @param {number} min
	* @param {number} max
	* @param {number} prev
	* @param {number} next
	*/
	jQuery.fn.jplist.ui.controls.RangeSliderDTO = function(dataPath, min, max, prev, next){
		
		return {
			path: dataPath
			,type: 'number'
			,filterType: 'range'
			,min: min
			,max: max
			,prev: prev
			,next: next
		};		
	};	
		
})();

