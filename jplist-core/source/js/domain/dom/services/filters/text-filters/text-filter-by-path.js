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
					/*
					if(text1.indexOf(text2) !== -1){
						resultDataview.push(dataitem);					
					}
					*/
										
					//value.text contains text
					if(jQuery.fn.jplist.domain.dom.services.FiltersService.advancedSearchParse(text1, text2)){						
						resultDataview.push(dataitem);
					}
				}
			}			
		}
		
		return resultDataview;
	};
	
	
})();	