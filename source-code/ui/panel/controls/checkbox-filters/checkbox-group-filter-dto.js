/**
* jQuery jPList Plugin ##VERSION## 
* Copyright 2014 Miriam Zusin. All rights reserved.
* http://jplist.com 
*/
(function(){
	'use strict';		
	
	/** 
	* Checkbox Group Filter Model
	* @constructor
	* @param {Array.<string>} pathGroup - list of paths
	*/
	jQuery.fn.jplist.ui.controls.CheckboxGroupFilterDTO = function(pathGroup){
		
		return {
			pathGroup: pathGroup
			,filterType: 'pathGroup'
		};
	};	
		
})();

