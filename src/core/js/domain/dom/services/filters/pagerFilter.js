(function(){
	'use strict';	
	
	/**
	* pagination filter
	* @param {Object} pagingObj - paging object
	* @param {Array.<jQuery.fn.jplist.DataItemModel>} dataview - collection dataview
	* @return {Array.<jQuery.fn.jplist.DataItemModel>}
	*/
	jQuery.fn.jplist.FiltersService.pagerFilter = function(pagingObj, dataview){
		return dataview.slice(pagingObj.start, pagingObj.end);
	};
	
})();	