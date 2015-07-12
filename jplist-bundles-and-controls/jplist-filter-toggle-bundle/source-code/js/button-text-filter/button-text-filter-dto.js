(function(){
	'use strict';		
	
	/** 
	* Button Text Filter Model
	* @constructor
	* @param {string} dataPath - data-path attribute
	* @param {string} value - button text filter data-text value
	* @param {string} ignore - ignore characters regex (defined in javascript in control's options)
	* @param {boolean} selected - if button is selected
	* @param {string} mode: startsWith, endsWith, contains, advanced
	*/
	jQuery.fn.jplist.ui.controls.ButtonTextFilterDTO = function(dataPath, value, ignore, selected, mode){
		
		return {
			path: dataPath		
			,ignore: ignore
			,value: value
			,selected: selected
			,mode: mode
			,filterType: 'TextFilter' //used in controller to define filter type
		};
	};	
		
})();

