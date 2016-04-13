(function(){
	'use strict';		
	
	/** 
	* Checkbox Dropdown DTO
	* @constructor
	* @param {Array.<string>} pathGroup - list of paths
	*/
	jQuery.fn.jplist.ui.controls.CheckboxDropdownFilter = function(pathGroup){
		
		return {
			pathGroup: pathGroup
			,filterType: 'pathGroup'
		};
	};	
		
})();

