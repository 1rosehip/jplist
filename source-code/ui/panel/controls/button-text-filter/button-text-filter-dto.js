/**
* jQuery jPList Plugin ##VERSION## 
* Copyright 2014 Miriam Zusin. All rights reserved.
* http://jplist.com 
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

