(function(){
	'use strict';		
	
	/** 
	* Bootstrap Dropdown Filter Model
	* @constructor
	* @param {string} dataPath - data-path attribute
	*/
	jQuery.fn.jplist.ui.controls.BootFilterDropdownDTO = function(dataPath){
		
		return {
			path: dataPath
			,filterType: 'path'
		};
	};	
		
})();

