;(function(){
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

