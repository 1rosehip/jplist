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

