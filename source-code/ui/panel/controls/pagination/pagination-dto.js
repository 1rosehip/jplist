/**
* jQuery jPList Plugin ##VERSION## 
* Copyright 2014 Miriam Zusin. All rights reserved.
* To use this file you must buy a licence at http://codecanyon.net/user/no81no/portfolio 
*/
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

