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

