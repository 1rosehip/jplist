(function(){
	'use strict';	
	
	/**
	* sort by index of dataitem (by id)
	* @param {jQuery.fn.jplist.domain.dom.models.DataItemModel} dataitem1
	* @param {jQuery.fn.jplist.domain.dom.models.DataItemModel} dataitem2
	* @param {string} order - sort order: asc or desc
	*/
	var sortIndex = function(dataitem1, dataitem2, order){
	
		var result
			,number1
			,number2;		
			
			//remove other characters
			number1 = dataitem1['index'];
			number2 = dataitem2['index'];
			
			if(number1 === number2){
				result = 0;
			}
			else{
				if(order == 'asc'){
					if(isNaN(number1)){
						result = 1;
					}	
					else{
						if(isNaN(number2)){
							result = -1;
						}
						else{
							result = number1 - number2;
						}
					}
				}
				else{
					if(isNaN(number1)){
						result = 1;
					}	
					else{
						if(isNaN(number2)){
							result = -1;
						}
						else{
							result = number2 - number1;
						}
					}
				}
			}
			
			return result;
	};
	
	/**
	* Double Sort (recursive)
	* @param {jQuery.fn.jplist.domain.dom.models.DataItemModel} dataitem1
	* @param {jQuery.fn.jplist.domain.dom.models.DataItemModel} dataitem2
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
	* @param {number} index - index in the statuses array
	* @return {number} - -1, 0, 1
	*/
	var doubleSort = function(dataitem1, dataitem2, statuses, index){
	
		var result = 0
			,currentStatus
			,service;
		
		//check current status data type
		if(statuses.length > 0){
			
			//get current status
			currentStatus = statuses[index];
			
			if(currentStatus.data.path != 'default'){
			
				service = jQuery.fn.jplist.app.services.DTOMapperService.sort[currentStatus.data.type];
				
				if(jQuery.isFunction(service)){				
					result = service(currentStatus, dataitem1, dataitem2);
				}				
				
			}
			else{
				result = sortIndex(dataitem1, dataitem2, 'asc');				
			}	

			//if items are equal
			if(result === 0){
				
				if(index + 1 < statuses.length){
					
					//get result (recursive)
					result = doubleSort(dataitem1, dataitem2, statuses, index + 1);
				}
			}
			
		}
		
		return result;
	};
	
	/**
	* Main Sort
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>} dataview - collection dataview
	* @return {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>}
	*/
	jQuery.fn.jplist.domain.dom.services.SortService.doubleSort = function(statuses, dataview){
	
		var preventSort = false;
		
		//if sort status only one and it's 'default' -> don't sort, because there is a random div bug in chrome/safari
		if(statuses.length === 1 && statuses[0] && statuses[0].data && statuses[0].data.path === 'default'){
			preventSort = true;
		}	
		
		if(!preventSort){
			dataview.sort(function(dataitem1, dataitem2){	
				return doubleSort(dataitem1, dataitem2, statuses, 0);
			});
		}
		
		return dataview;
	};
	
})();	