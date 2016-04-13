(function(){
	'use strict';	
	
	/**
	* date range filter - range filter
	* @param {jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel} path - path object
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>} dataview - collection dataview
	* @param {string} format - datetime format
	* @param {number} prevYear
	* @param {number} prevMonth
	* @param {number} prevDay
	* @param {number} nextYear
	* @param {number} nextMonth
	* @param {number} nextDay
	* @return {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>}
	*/
	jQuery.fn.jplist.domain.dom.services.FiltersService.dateRangeFilter = function(path
															,dataview
															,format
															,prevYear
															,prevMonth
															,prevDay
															,nextYear
															,nextMonth
															,nextDay){
	
		var resultDataview = []
			,dataitem
			,pathitem
			,isPrevDateNotValid
			,isNextDateNotValid
			,prevDate
			,nextDate
			,pathitemDate;
		
		for(var i=0; i<dataview.length; i++){
		
			//get dataitem
			dataitem = dataview[i];
			
			//find value by path
			pathitem = dataitem.findPathitem(path);
			
			//if path is found
			if(pathitem){
				
				//is valid
				isPrevDateNotValid = (!jQuery.isNumeric(prevYear) || !jQuery.isNumeric(prevMonth) || !jQuery.isNumeric(prevDay));
				isNextDateNotValid = (!jQuery.isNumeric(nextYear) || !jQuery.isNumeric(nextMonth) || !jQuery.isNumeric(nextDay));
				
				if(isPrevDateNotValid || isNextDateNotValid){				
					resultDataview.push(dataitem);	
				}
				else{
					
					//get date from pathitem (by its text value)
					pathitemDate = jQuery.fn.jplist.domain.dom.services.HelperService.formatDateTime(pathitem.text, format);
					
					if(pathitemDate && jQuery.isFunction(pathitemDate.getFullYear)){						
						
						//prev date
						prevDate = new Date(prevYear, prevMonth, prevDay);
						nextDate = new Date(nextYear, nextMonth, nextDay);						
											
						//zero time
						pathitemDate.setHours(0);
						pathitemDate.setMinutes(0);
						pathitemDate.setSeconds(0);
						
						if(pathitemDate >= prevDate && pathitemDate <= nextDate){
							resultDataview.push(dataitem);	
						}
					}
				}
			}
			
		}
		
		return resultDataview;
	};
	
})();	