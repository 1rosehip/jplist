;(function(){
	'use strict';	
	
	/**
	 * textFilter - filter dataview by text in the given jquery path
	 * @param {string} text - filter text
	 * @param {jQuery.fn.jplist.PathModel} path - path object
	 * @param {Array.<jQuery.fn.jplist.DataItemModel>} dataview - collection dataview
	 * @param {string} ignoreRegex
	 * @param {string} mode: startsWith, endsWith, contains, advanced, equal
     * @param {string=} not - not operators; can be 1 string or json
     * @param {string=} and - not operators; can be 1 string or json
     * @param {string=} or - not operators; can be 1 string or json
	 * @return {Array.<jQuery.fn.jplist.DataItemModel>}
	 */
	jQuery.fn.jplist.FiltersService.textFilter = function(text, path, dataview, ignoreRegex, mode, not, and, or){

		var dataitem
			,pathitem
			,resultDataview = []
			,text1
			,text2;

		//default mode -> contains
		mode = mode || 'contains';

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

					text1 = jQuery.trim(jQuery.fn.jplist.HelperService.removeCharacters(pathitem.text, ignoreRegex));
					text2 = jQuery.trim(jQuery.fn.jplist.HelperService.removeCharacters(text, ignoreRegex));

					switch(mode){
						
						case 'startsWith':{
							
							//value.text starts with text
							if(text1.startsWith(text2)){
								resultDataview.push(dataitem);					
							}
							
							break;
						}
						
						case 'endsWith':{
							
							//value.text ends with text
							if(text1.endsWith(text2)){
								resultDataview.push(dataitem);					
							}
							
							break;
						}
						
						case 'advanced':{

							//value.text contains text
							if(jQuery.fn.jplist.FiltersService.advancedSearchParse(text1, text2, ignoreRegex, not, and, or)){
								resultDataview.push(dataitem);
							}
							break;
						}
						case 'equal':{
							
							//value.text contains text
							if(text1 === text2){						
								resultDataview.push(dataitem);
							}
							break;
						}
						
						default:{

							//value.text contains text
							if(text1.indexOf(text2) !== -1){
								resultDataview.push(dataitem);
							}
							
							break;
						}
					}
					
				}
			}			
		}

		return resultDataview;
	};
	
	
})();	
