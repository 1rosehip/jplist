/**
* jPList - jQuery Data Grid Controls ##VERSION## - http://jplist.com 
* Copyright 2014 Miriam Zusin. All rights reserved.
* For non-commercial, personal, or open source projects and applications, you may use jPList for free under the terms of the GPL V3 License (https://gnu.org/licenses/gpl.html)
* If your project generates any type of income, e.g. sells products, ads, services or just represents a commercial company, you should get a commercial license at http://www.binpress.com
*/
(function(){
	'use strict';	
	
	/**
	* sort numbers
	* @param {jQuery.fn.jplist.domain.dom.models.DataItemModel} dataitem1
	* @param {jQuery.fn.jplist.domain.dom.models.DataItemModel} dataitem2
	* @param {string} order - sort order: asc or desc
	* @param {jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel} path - path object	
	*/
	jQuery.fn.jplist.domain.dom.services.SortService.numbersHelper = function(dataitem1, dataitem2, order, path){
	
		var pathitem1
			,pathitem2
			,number1
			,number2
			,result;
			
			pathitem1 = dataitem1.findPathitem(path);
			pathitem2 = dataitem2.findPathitem(path);			
			
			if(pathitem1 && pathitem2){
				//remove other characters
				number1 = parseFloat(pathitem1.text.replace(/[^-0-9\.]+/g,''));
				number2 = parseFloat(pathitem2.text.replace(/[^-0-9\.]+/g,''));
				
				if(number1 == number2){
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
			}
			else{
				return 0;
			}
	};
	
	/**
	* Sort numbers api (not used directly in the plugin)
	* @param {string} order - sort order: asc or desc
	* @param {jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel} path - path object
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>} dataview - collection dataview
	* @memberOf jQuery.fn.jplist.domain.dom.services.SortService
	*/
	jQuery.fn.jplist.domain.dom.services.SortService.numbers = function(order, path, dataview){
	
		dataview.sort(function(dataitem1, dataitem2){
			return jQuery.fn.jplist.domain.dom.services.SortService.numbersHelper(dataitem1, dataitem2, order, path);
		});
	};
	
})();	