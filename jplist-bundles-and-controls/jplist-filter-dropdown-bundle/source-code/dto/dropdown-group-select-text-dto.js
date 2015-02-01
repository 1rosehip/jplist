(function(){
	'use strict';		
	
	/** 
	* Text Filter Dropdown Group Model
	* @constructor
	* @param {Array.<string>} textGroup - list of text values
    * @param {string} logic - 'or' / 'and'
    * @param {string} path - data-path attribute of the control
    * @param {string} ignoreRegex
	*/
	jQuery.fn.jplist.ui.controls.TextFilterDropdownGroupDTO = function(textGroup, logic, path, ignoreRegex){
		
		return {
			textGroup: textGroup
            ,logic: logic
            ,path: path
            ,ignoreRegex: ignoreRegex
			,filterType: 'textGroup'
		};
	};	
		
})();

