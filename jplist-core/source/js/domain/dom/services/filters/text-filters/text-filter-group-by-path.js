;(function(){
	'use strict';	
	
	/**
	* textFilterPathGroup - filter by the given text value in the group of paths
	* @param {Array.<Object>} textAndPathsGroup - list of Objects like {text: '', path: '', selected: true/false}	
	* @param {string} ignoreRegex
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>} dataview - collection dataview
	* @param {string} mode: startsWith, endsWith, contains, advanced
	* @return {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>}
	*/
	jQuery.fn.jplist.domain.dom.services.FiltersService.textFilterPathGroup = function(textAndPathsGroup, ignoreRegex, dataview, mode){
	
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
								
								text1 = jQuery.trim(jQuery.fn.jplist.domain.dom.services.HelperService.removeCharacters(pathitem.text, ignoreRegex));
								text2 = jQuery.trim(jQuery.fn.jplist.domain.dom.services.HelperService.removeCharacters(textAndPathObj.text, ignoreRegex));
								
								switch(textAndPathObj.mode){
						
									case 'startsWith':{
										
										//value.text starts with text
										if(text1.startsWith(text2)){
											includeItem = true;					
										}
										
										break;
									}
									
									case 'endsWith':{
										
										//value.text ends with text
										if(text1.endsWith(text2)){
											includeItem = true;						
										}
										
										break;
									}
									
									case 'advanced':{
									
										//value.text contains text
										if(jQuery.fn.jplist.domain.dom.services.FiltersService.advancedSearchParse(text1, text2)){						
											includeItem = true;	
										}
										break;
									}
									
									default:{
										
										//value.text contains text
										if(text1.indexOf(text2) !== -1){
											includeItem = true;					
										}
										
										break;
									}
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