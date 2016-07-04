(function(){
	'use strict';		
	
	/** 
	* Sort Buttons Data Transfter Object
	* @constructor
	* @param {string} dataPath - textbox data-path attribute
	* @param {string} type - text, number or datetime
	* @param {string} order - 'asc' or 'desc'
	* @param {string} dateTimeFormat - like {day}.{month}.{year} //{year}, {month}, {day}, {hour}, {min}, {sec}
	* @param {string} ignore - ignore regex
	* @param {boolean} isSelected
	*/
	jQuery.fn.jplist.controls.SortButtonDTO = function(dataPath, type, order, dateTimeFormat, ignore, isSelected){
		
		return {
			path: dataPath
			,type: type
			,order: order
			,dateTimeFormat: dateTimeFormat
			,ignore: ignore
			,selected: isSelected
		};
	};
	
	/** 
	* Sort Buttons Group Data Transfter Object
	* @constructor
	* @param {Array.<jQuery.fn.jplist.controls.SortButtonDTO>} sortGroup
	*/
	jQuery.fn.jplist.controls.SortButtonsGroupDTO = function(sortGroup){
		
		return {
			sortGroup: sortGroup
		};
	};
		
})();

