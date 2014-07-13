/**
* jPList - jQuery Data Grid Controls ##VERSION## - http://jplist.com 
* Copyright 2014 Miriam Zusin. All rights reserved.
* For non-commercial, personal, or open source projects and applications, you may use jPList for free  http://www.binpress.com/license/read/id/2749/app/2085
* If your project generates any type of income, e.g. sells products, ads, services or just represents a commercial company, you should get a commercial license at http://www.binpress.com
*/
(function(){
	'use strict';	
	
	/**
	* textFilter - filter dataview by text in the given jquery path
	* @param {string} text - filter text
	* @param {jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel} path - path object
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>} dataview - collection dataview
	* @param {string} ignoreRegex
	* @return {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>}
	*/
	jQuery.fn.jplist.domain.dom.services.FiltersService.textFilter = function(text, path, dataview, ignoreRegex){
	
		var dataitem
			,pathitem
			,resultDataview = []
			,text1
			,text2;
		
		for(var i=0; i<dataview.length; i++){
		
			//get dataitem
			dataitem = dataview[i];
			
			//find value by path
			pathitem = dataitem.findPathitem(path);
			
			if(path.jqPath === 'default'){
				
				//default drop down choice
				resultDataview.push(dataitem);
			}
			else{
				//if path is found
				if(pathitem){
					
					text1 = jQuery.fn.jplist.domain.dom.services.HelperService.removeCharacters(pathitem.text, ignoreRegex);
					text2 = jQuery.fn.jplist.domain.dom.services.HelperService.removeCharacters(text, ignoreRegex);
					
					//value.text contains text
					if(text1.indexOf(text2) !== -1){
						resultDataview.push(dataitem);					
					}
				}
			}			
		}
		
		return resultDataview;
	};
	
	
})();	