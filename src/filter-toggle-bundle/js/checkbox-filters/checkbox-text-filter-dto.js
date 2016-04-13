(function(){
	'use strict';		
	
	/** 
	* Checkbox Text Filter Model
	* @constructor
	* @param {Array.<string>} textGroup - list of text values
    * @param {string} logic - 'or' / 'and'
    * @param {string} path - data-path attribute of the control
    * @param {string} ignoreRegex
	* @param {string} mode: startsWith, endsWith, contains, advanced
	*/
	jQuery.fn.jplist.ui.controls.CheckboxTextFilterDTO = function(textGroup, logic, path, ignoreRegex, mode){
		
		return {
			textGroup: textGroup
            ,logic: logic
            ,path: path
            ,ignoreRegex: ignoreRegex
			,mode: mode
			,filterType: 'textGroup'
		};
	};	
		
})();

