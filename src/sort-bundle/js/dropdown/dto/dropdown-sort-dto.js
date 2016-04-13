(function(){
	'use strict';		
	
	/** 
	* Dropdown Sort Model
	* @constructor
	* @param {string} dataPath - textbox data-path attribute
	* @param {string} type - text, number or datetime
	* @param {string} order - 'asc' or 'desc'
	* @param {string} dateTimeFormat - like {day}.{month}.{year} //{year}, {month}, {day}, {hour}, {min}, {sec}
	* @param {string} ignore - ignore regex
	* @param {Array.<string>} additionalPaths - used for multiple sort
	*/
	jQuery.fn.jplist.ui.controls.DropdownSortDTO = function(dataPath, type, order, dateTimeFormat, ignore, additionalPaths){
		
		return {
			path: dataPath
			,type: type
			,order: order
			,dateTimeFormat: dateTimeFormat
			,ignore: ignore
			,additionalPaths: additionalPaths
		};
	};	
		
})();

