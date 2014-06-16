/**
* jPList - jQuery Data Grid Controls ##VERSION## - http://jplist.com 
* Copyright 2014 Miriam Zusin. All rights reserved.
* For non-commercial, personal, or open source projects and applications, you may use jPList for free under the terms of the GPL V3 License (https://gnu.org/licenses/gpl.html)
* If your project generates any type of income, e.g. sells products, ads, services or just represents a commercial company, you should get a commercial license at http://www.binpress.com
*/
(function(){
	'use strict';		
	
	/** 
	* Checkbox Text Filter Model
	* @constructor
	* @param {Array.<string>} textGroup - list of text values
    * @param {string} logic - 'or' / 'and'
    * @param {string} path - data-path attribute of the control
    * @param {string} ignoreRegex
	*/
	jQuery.fn.jplist.ui.controls.CheckboxTextFilterDTO = function(textGroup, logic, path, ignoreRegex){
		
		return {
			textGroup: textGroup
            ,logic: logic
            ,path: path
            ,ignoreRegex: ignoreRegex
			,filterType: 'textGroup'
		};
	};	
		
})();

