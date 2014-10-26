(function(){
	'use strict';		
	
	/** 
	* Pagination Model
	* @constructor
	* @param {number} currentPage
	* @param {number} itemsPerPage - (should be used only if dropdown 'items per page' is absent)
	*/
	jQuery.fn.jplist.ui.controls.PaginationDTO = function(currentPage, itemsPerPage){
		
		var data = {
			currentPage: currentPage
			,paging: null
		};	
		
		if(itemsPerPage){
			data.number = itemsPerPage;
		}
		
		return data;
	};	
		
})();

