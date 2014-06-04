/**
* jQuery jPList Plugin ##VERSION## 
* Copyright 2014 Miriam Zusin. All rights reserved.
* To use this file you must buy a licence at http://codecanyon.net/user/no81no/portfolio 
*/
(function(){
	'use strict';		
	
	/** 
	* Textbox Model
	* @constructor
	* @param {string} dataPath - textbox data-path attribute
	* @param {string} value - textbox value
	* @param {string} ignore - ignore characters regex (defined in javascript in control's options)
	*/
	jQuery.fn.jplist.ui.controls.TextboxDTO = function(dataPath, value, ignore){
		
		return {
			path: dataPath
			,ignore: ignore
			,value: value
			,filterType: 'TextFilter'
		};
	};	
		
})();

