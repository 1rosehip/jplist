(function(){
	'use strict';	
	
	/**
	* pathGroupFilter - filter dataview by paths group - used for checkboxes group
	* @param {Array.<string>} pathGroup - list of paths
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>} dataview - collection dataview
	* @return {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>}
	*/
	jQuery.fn.jplist.domain.dom.services.FiltersService.pathGroupFilter = function(pathGroup, dataview){
	
		var path
			,pathObj
			,paths = []
			,dataitem
			,pathitem
			,resultDataview = [];
		
		if(pathGroup.length <= 0){
			return dataview;
		}
		else{
			//init paths list
			for(var p=0; p<pathGroup.length; p++){
				
				//get path
				path = pathGroup[p];
				
				//create path object
				pathObj = new jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel(path, null);
				
				//add to paths list
				paths.push(pathObj);
			}
			
			for(var i=0; i<dataview.length; i++){
				
				//get dataitem
				dataitem = dataview[i];		
				
				for(var j=0; j<paths.length; j++){
					
					//get path object
					pathObj = paths[j];
					
					if(pathObj.jqPath === 'default'){
						
						//default drop down choice
						resultDataview.push(dataitem);
						break;
					}
					else{
						//find value by path
						pathitem = dataitem.findPathitem(pathObj);
						
						//if path is found
						if(pathitem){										
							resultDataview.push(dataitem);	
						}
					}
				}
			}
		}
		
		return resultDataview;
	};
	
})();	