/**
* jQuery jPList Plugin ##VERSION## 
* Copyright 2014 Miriam Zusin. All rights reserved.
* To use this file you must buy a licence at http://codecanyon.net/user/no81no/portfolio 
*/
(function(){
	'use strict';		
	
	/** 
	* Button Text Filter Group Model
	* @constructor
	* @param {Array.<Object>} textAndPathsGroup - list of Objects like {text: '', path: '', selected: true/false}	
	* @param {string} ignore - ignore characters regex (defined in javascript in control's options)
	*/
	jQuery.fn.jplist.ui.controls.ButtonTextFilterGroupDTO = function(textAndPathsGroup, ignore){
		
		return {
			textAndPathsGroup: textAndPathsGroup
			,ignore: ignore
			,filterType: 'textFilterPathGroup' //used in controller to define filter type
		};
	};	
		
})();

