/**
* jQuery jPList Plugin ##VERSION## 
* Copyright 2014 Miriam Zusin. All rights reserved.
* To use this file you must buy a licence at http://codecanyon.net/user/no81no/portfolio 
*/
(function(){
	'use strict';		
	
	/** 
	* Dropdown Filter Model
	* @constructor
	* @param {string} dataPath - textbox data-path attribute
	* @param {string} type - text, number or datetime
	*/
	jQuery.fn.jplist.ui.controls.DropdownFilterDTO = function(dataPath, type){
		
		return {
			path: dataPath
			,type: type
			,filterType: 'path'
		};
	};	
		
})();

