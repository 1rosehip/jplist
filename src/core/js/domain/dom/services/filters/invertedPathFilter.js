(function(){
	'use strict';	
	
	/**
	* invertedPathFilter - filter dataview by path: only items not in the given path are allowed
	* @param {jQueryObject} checkedCheckboxes - checked checkboxes list
	* @param {Array.<jQuery.fn.jplist.DataItemModel>} dataview - stores dataview
	* @return {Array.<jQuery.fn.jplist.DataItemModel>}
	*/
	jQuery.fn.jplist.FiltersService.invertedPathFilter = function(checkedCheckboxes, dataview){
		
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
						path = new jQuery.fn.jplist.PathModel(dataPath, null);
						
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