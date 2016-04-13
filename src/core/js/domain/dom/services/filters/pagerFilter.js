(function(){
	'use strict';	
	
	/**
	* pagination filter
	* @param {Object} pagingObj - paging object
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>} dataview - collection dataview
	* @return {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>}
	*/
	jQuery.fn.jplist.domain.dom.services.FiltersService.pagerFilter = function(pagingObj, dataview){
		return dataview.slice(pagingObj.start, pagingObj.end);
	};
	
})();	