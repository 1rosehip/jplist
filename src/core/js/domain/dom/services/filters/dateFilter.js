(function(){
	'use strict';	
	
	/**
	* date filter - filter dataview by date in the given jquery path
	* @param {number} year
	* @param {number} month
	* @param {number} day
	* @param {jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel} path - path object
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>} dataview - collection dataview
	* @param {string} format - datetime format
	* @return {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>}
	*/
	jQuery.fn.jplist.domain.dom.services.FiltersService.dateFilter = function(year, month, day, path, dataview, format){
	
		var dataitem
			,pathitem
			,resultDataview = []
			,pathitemDate
			,currentDate;
		
		for(var i=0; i<dataview.length; i++){
		
			//get dataitem
			dataitem = dataview[i];
			
			//find value by path
			pathitem = dataitem.findPathitem(path);
			
			//if path is found
			if(pathitem){
				
				if(!jQuery.isNumeric(year) || !jQuery.isNumeric(month) || !jQuery.isNumeric(day)){				
					resultDataview.push(dataitem);	
				}
				else{
				
					//get date from pathitem (by its text value)
					pathitemDate = jQuery.fn.jplist.domain.dom.services.HelperService.formatDateTime(pathitem.text, format);
					
					if(pathitemDate && jQuery.isFunction(pathitemDate.getFullYear)){
						
						//get current date
						currentDate = new Date(year, month, day);
						
						//zero time
						pathitemDate.setHours(0);
						pathitemDate.setMinutes(0);
						pathitemDate.setSeconds(0);
												
						if((pathitemDate.getFullYear() === year) && (pathitemDate.getMonth() === month) && (pathitemDate.getDate() === day)){							
							resultDataview.push(dataitem);	
						}
					}
				}
			}
			
		}
		
		return resultDataview;
	};
	
})();	