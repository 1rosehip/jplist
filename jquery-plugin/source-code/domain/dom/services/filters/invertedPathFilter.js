/**
* jPList - jQuery Data Grid Controls ##VERSION## - http://jplist.com 
* Copyright 2014 Miriam Zusin. All rights reserved.
* For non-commercial, personal, or open source projects and applications, you may use jPList for free  http://www.binpress.com/license/read/id/2749/app/2085
* If your project generates any type of income, e.g. sells products, ads, services or just represents a commercial company, you should get a commercial license at http://www.binpress.com
*/
(function(){
	'use strict';	
	
	/**
	* invertedPathFilter - filter dataview by path: only items not in the given path are allowed
	* @param {jQueryObject} checkedCheckboxes - checked checkboxes list
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>} dataview - stores dataview
	* @return {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>}
	*/
	jQuery.fn.jplist.domain.dom.services.FiltersService.invertedPathFilter = function(checkedCheckboxes, dataview){	
		
		var dataitem
			,pathitem
			,resultDataview = []
			,path
			,dataPath
			,addFlag = false
			,cb;		
		
		for(var i=0; i<dataview.length; i++){
		
			//get dataitem
			dataitem = dataview[i];		

			//set flag to false
			addFlag = false;
			
			if(checkedCheckboxes && checkedCheckboxes.length > 0){
			
				for(var j=0; j<checkedCheckboxes.length; j++){
				
					//get checkboxe
					cb = checkedCheckboxes.eq(j);
					
					//get path
					dataPath = cb.attr('data-path').toString();
					
					if(dataPath == 'default'){
						addFlag = true;					
					}
					else{
						//get data path
						path = new jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel(dataPath, null); 
						
						//find value by path
						pathitem = dataitem.findPathitem(path);
						
						if(pathitem){										
							addFlag = true;	
						}
					}			
				}
				
				if(addFlag){
					resultDataview.push(dataitem);
				}
			}
		}
		
		return resultDataview;
		
	};
	
})();	