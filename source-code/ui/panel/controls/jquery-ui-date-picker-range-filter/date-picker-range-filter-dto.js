/**
* @license jPList - jQuery Data Grid Controls ##VERSION## - http://jplist.com 
* Copyright 2014 Miriam Zusin. All rights reserved.
* For non-commercial, personal, or open source projects and applications, you may use jPList for free under the terms of the GPL V3 License (https://gnu.org/licenses/gpl.html)
* If your project generates any type of income, e.g. sells products, ads, services or just represents a commercial company, you should get a commercial license at http://www.binpress.com
*/
(function(){
	'use strict';		
	
	/** 
	* jQuery UI date pciker range filter model
	* @constructor
	* @param {string} dataPath - DatePickerRangeFilter data-path attribute
	* @param {string} dateTimeFormat
	* @param {Date|string} prevDate
	* @param {Date|string} nextDate
	*/
	jQuery.fn.jplist.ui.controls.DatePickerRangeFilterDTO = function(dataPath, dateTimeFormat, prevDate, nextDate){
		
		var result = {
			path: dataPath
			,format: dateTimeFormat
			,filterType: 'dateRange'
			,prev_year: ''
			,prev_month: ''
			,prev_day: ''
			,next_year: ''
			,next_month: ''
			,next_day: ''
		};
		
		if(prevDate){
			result.prev_year = prevDate.getFullYear();
			result.prev_month = prevDate.getMonth();
			result.prev_day = prevDate.getDate();
		}
		
		if(nextDate){
			result.next_year = nextDate.getFullYear();
			result.next_month = nextDate.getMonth();
			result.next_day = nextDate.getDate();
		}
		
		return result;		
	};	
		
})();

