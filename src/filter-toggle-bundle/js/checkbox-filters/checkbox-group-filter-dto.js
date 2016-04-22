(function(){
	'use strict';		
	
	/** 
	* Checkbox Group Filter Model
	* @constructor
	* @param {Array.<string>} pathGroup - list of paths
	*/
	jQuery.fn.jplist.controls.CheckboxGroupFilterDTO = function(pathGroup){
		
		return {
			pathGroup: pathGroup
			,filterType: 'pathGroup'
		};
	};	
		
})();

