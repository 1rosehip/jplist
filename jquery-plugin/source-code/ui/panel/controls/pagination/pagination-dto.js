/**
* jPList - jQuery Data Grid Controls ##VERSION## - http://jplist.com 
* Copyright 2014 Miriam Zusin. All rights reserved.
* For non-commercial, personal, or open source projects and applications, you may use jPList for free  http://www.binpress.com/license/read/id/2749/app/2085
* If your project generates any type of income, e.g. sells products, ads, services or just represents a commercial company, you should get a commercial license at http://www.binpress.com
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

