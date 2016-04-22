(function(){
	'use strict';	
	
	/**
	* rangeFilter - range filter
	* @param {jQuery.fn.jplist.PathModel} path - path object
	* @param {Array.<jQuery.fn.jplist.DataItemModel>} dataview - collection dataview
	* @param {number} min
	* @param {number} max
	* @param {number} prev
	* @param {number} next
	* @return {Array.<jQuery.fn.jplist.DataItemModel>}
	*/
	jQuery.fn.jplist.FiltersService.rangeFilter = function(path, dataview, min, max, prev, next){
	
		var resultDataview = []
			,dataitem
			,pathitem
			,num
			,prevNumeric = jQuery.isNumeric(prev)
			,nextNumeric = jQuery.isNumeric(next);
		
		for(var i=0; i<dataview.length; i++){
		
			//get dataitem
			dataitem = dataview[i];			
			
			//find value by path
			pathitem = dataitem.findPathitem(path);	

			//if path is found
			if(pathitem){										
				
				//get number				
				num = Number(pathitem.text.replace(/[^-0-9\.]+/g,''));
					
				if(!isNaN(num)){
				
					if(prevNumeric && nextNumeric){
					
						if(num >= prev && num <= next){
							
							//add to list
							resultDataview.push(dataitem);
						}
					}
					else{
						
						//min exists, and max doesn't exist
						if(prevNumeric && !nextNumeric){
						
							if(num >= prev){
								
								//add to list
								resultDataview.push(dataitem);
							}
						}
						else{
						
							//max exists, and min doesn't exist
							if(!prevNumeric && nextNumeric){
							
								if(num <= next){
									
									//add to list
									resultDataview.push(dataitem);
								}
							}
						}
					}					
				}
			}
		}
		
		return resultDataview;
	};
	
})();	