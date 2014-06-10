/**
* @license jPList - jQuery Data Grid Controls ##VERSION## - http://jplist.com 
* Copyright 2014 Miriam Zusin. All rights reserved.
* For non-commercial, personal, or open source projects and applications, you may use jPList for free under the terms of the GPL V3 License (https://gnu.org/licenses/gpl.html)
* If your project generates any type of income, e.g. sells products, ads, services or just represents a commercial company, you should get a commercial license at http://www.binpress.com
*/
(function(){
	'use strict';	
	
	/**
	* rangeFilter - range filter
	* @param {jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel} path - path object
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>} dataview - collection dataview
	* @param {number} min
	* @param {number} max
	* @param {number} prev
	* @param {number} next
	* @return {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>}
	*/
	jQuery.fn.jplist.domain.dom.services.FiltersService.rangeFilter = function(path, dataview, min, max, prev, next){
	
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