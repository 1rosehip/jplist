/**
* jPList - jQuery Data Grid Controls ##VERSION## - http://jplist.com 
* Copyright 2014 Miriam Zusin. All rights reserved.
* For non-commercial, personal, or open source projects and applications, you may use jPList for free  http://www.binpress.com/license/read/id/2749/app/2085
* If your project generates any type of income, e.g. sells products, ads, services or just represents a commercial company, you should get a commercial license at http://www.binpress.com
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

