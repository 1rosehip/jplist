(function(){
	'use strict';	
	
	/**
	* pathFilter - filter dataview by path: only items with the given path are allowed
	* @param {jQuery.fn.jplist.PathModel} path - path object
	* @param {Array.<jQuery.fn.jplist.DataItemModel>} dataview - collection dataview
	* @return {Array.<jQuery.fn.jplist.DataItemModel>}
	*/
	jQuery.fn.jplist.FiltersService.pathFilter = function(path, dataview){
	
		var dataitem
			,pathitem
			,resultDataview = [];
		
		for(var i=0; i<dataview.length; i++){
		
			//get dataitem
			dataitem = dataview[i];			
			
			if(path.jqPath === 'default'){
				
				//default drop down choice
				resultDataview.push(dataitem);
			}
			else{
				//find value by path
				pathitem = dataitem.findPathitem(path);				
				
				//if path is found
				if(pathitem){										
					resultDataview.push(dataitem);	
				}
			}			
		}
		
		return resultDataview;
	};
	
})();	