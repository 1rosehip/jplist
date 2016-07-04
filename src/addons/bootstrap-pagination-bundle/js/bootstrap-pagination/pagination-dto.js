(function(){
	'use strict';		
	
	/** 
	* Bootstrap Pagination Model
	* @constructor
	* @param {number} currentPage
	* @param {number} itemsPerPage - (should be used only if dropdown 'items per page' is absent)
	*/
	jQuery.fn.jplist.controls.BootstrapPaginationDTO = function(currentPage, itemsPerPage){
		
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

