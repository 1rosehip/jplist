(function(){
	'use strict';		
	
	/** 
	* jQuery UI date pciker filter model
	* @constructor
	* @param {string} dataPath - DatePickerFilter data-path attribute
	* @param {string} dateTimeFormat
	* @param {Date|string} currentDate
	*/
	jQuery.fn.jplist.ui.controls.DatePickerFilterDTO = function(dataPath, dateTimeFormat, currentDate){
		
		var result = {
			path: dataPath
			,format: dateTimeFormat
			,filterType: 'date'
			,year: ''
			,month: ''
			,day: ''
		};
		
		if(currentDate){
			result.year = currentDate.getFullYear();
			result.month = currentDate.getMonth();
			result.day = currentDate.getDate();
		}
		
		return result;		
	};	
		
})();

