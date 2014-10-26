(function(){
	'use strict';	
			
	/**
	* sort datetime
	* @param {jQuery.fn.jplist.domain.dom.models.DataItemModel} dataitem1
	* @param {jQuery.fn.jplist.domain.dom.models.DataItemModel} dataitem2
	* @param {string} order - sort order: asc or desc
	* @param {jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel} path - path object
	* @param {string} dateTimeFormat
	*/
	jQuery.fn.jplist.domain.dom.services.SortService.datetimeHelper = function(dataitem1, dataitem2, order, path, dateTimeFormat){
	
		var pathitem1
			,pathitem2
			,date1
			,date2;
			
			pathitem1 = dataitem1.findPathitem(path);
			pathitem2 = dataitem2.findPathitem(path);

			if(pathitem1 && pathitem2){

				//remove other characters
				if(!jQuery.trim(dateTimeFormat)){
					date1 = new Date(Date.parse(pathitem1.text)); 
					date2 = new Date(Date.parse(pathitem2.text)); 
				}
				else{
					date1 = jQuery.fn.jplist.domain.dom.services.HelperService.formatDateTime(pathitem1.text, dateTimeFormat);
					date2 = jQuery.fn.jplist.domain.dom.services.HelperService.formatDateTime(pathitem2.text, dateTimeFormat);
				}
				
				if(date1 == date2){
					return 0;
				}
				else{

					if(order == 'asc'){
						return date1 > date2 ? 1 : -1; 
					}
					else{
						return date1 < date2 ? 1 : -1; 
					}
				}	
			}
			else{
				return 0;
			}
	};
	
	/**
	* Sort datetime api (not used directly in the plugin)
	* @param {string} order - sort order: asc or desc
	* @param {jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel} path - path object
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>} dataview - collection dataview
	* @param {string} dateTimeFormat
	* @memberOf jQuery.fn.jplist.domain.dom.services.SortService
	*/
	jQuery.fn.jplist.domain.dom.services.SortService.datetime = function(order, path, dataview, dateTimeFormat){
	
		dataview.sort(function(dataitem1, dataitem2){
			return jQuery.fn.jplist.domain.dom.services.SortService.datetimeHelper(dataitem1, dataitem2, order, path, dateTimeFormat);
		});
	};
	
})();	