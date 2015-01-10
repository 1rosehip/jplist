(function(){
	'use strict';	
	
	/**
	* textFilter - filter dataview by text in the given jquery path
	* filter by the given text value in the group of paths
	* @param {Array.<Object>} textAndPathsGroup - list of Objects like {text: '', path: '', selected: true/false}	
	* @param {string} ignoreRegex
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>} dataview - collection dataview
	* @return {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>}
	*/
	jQuery.fn.jplist.domain.dom.services.FiltersService.textFilterPathGroup = function(textAndPathsGroup, ignoreRegex, dataview){
	
		var path
			,pathObj
			,dataitem
			,pathitem
			,selected = []
			,resultDataview = []
			,text1
			,text2
			,textAndPathObj
			,includeItem;
			
		//get selected objects and init path objects
		for(var p=0; p<textAndPathsGroup.length; p++){
			
			//get text and path object
			textAndPathObj = textAndPathsGroup[p];
			
			if(textAndPathObj.selected){
			
				//get path
				path = textAndPathObj.path;
				
				//create path object
				pathObj = new jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel(path, null);
				
				//add to paths list
				textAndPathObj['pathObj'] = pathObj;
				
				selected.push(textAndPathObj);
			}
		}
		
		if(selected.length <= 0){
			return dataview;
		}
		else{
			for(var i=0; i<dataview.length; i++){
				
				//get dataitem
				dataitem = dataview[i];	
					
				//update flag
				includeItem = false;
				
				for(var j=0; j<selected.length; j++){
					
					//get text and path object
					textAndPathObj = selected[j];
					
					//get path object
					pathObj = textAndPathObj['pathObj'];
					
					if(pathObj){
					
						if(pathObj.jqPath === 'default'){
							
							includeItem = true;
							break;
						}
						else{
							//find value by path
							pathitem = dataitem.findPathitem(pathObj);
							
							//if path is found
							if(pathitem){				
								
								text1 = jQuery.fn.jplist.domain.dom.services.HelperService.removeCharacters(pathitem.text, ignoreRegex);
								text2 = jQuery.fn.jplist.domain.dom.services.HelperService.removeCharacters(textAndPathObj.text, ignoreRegex);
								
								/*
								//value.text contains text
								if(text1.indexOf(text2) !== -1){
									includeItem = true;				
								}
								*/
								
								//value.text contains text
								if(jQuery.fn.jplist.domain.dom.services.FiltersService.advancedSearchParse(text1, text2)){
									includeItem = true;	
								}
							}
						}
					}
				}
			
				if(includeItem){
					resultDataview.push(dataitem);
				}
			}
		}		
		
		return resultDataview;
	};
	
	
})();	