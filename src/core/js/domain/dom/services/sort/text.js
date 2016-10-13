(function(){
	'use strict';	
	
	/**
	* sort text
	* @param {jQuery.fn.jplist.DataItemModel} dataitem1
	* @param {jQuery.fn.jplist.DataItemModel} dataitem2
	* @param {string} order - sort order: asc or desc
	* @param {jQuery.fn.jplist.PathModel} path - path object
	* @param {string} ignore - remove characters regex expression
	*/
	jQuery.fn.jplist.SortService.textHelper = function(dataitem1, dataitem2, order, path, ignore){
		
		var pathitem1
			,pathitem2
			,text1
			,text2
			,regexExpr;
		
		pathitem1 = dataitem1.findPathitem(path);
		pathitem2 = dataitem2.findPathitem(path);	
		
		if(pathitem1 && pathitem2){
		
			if(ignore){
			
				//create regex
				regexExpr = new RegExp(ignore, 'ig');
				
				//remove other characters
				text1 = pathitem1.text.toString().replace(regexExpr, '').toLowerCase();
				text2 = pathitem2.text.toString().replace(regexExpr, '').toLowerCase();

			}
			else{
				
				//remove other characters
				text1 = pathitem1.text.toString().toLowerCase(); //.replace(/[^a-zA-Z0-9]+/g,'')
				text2 = pathitem2.text.toString().toLowerCase(); //.replace(/[^a-zA-Z0-9]+/g,'')
			}
			
			if(text1 === text2){
				return 0;
			}
			else{
                if(''.localeCompare){

                    if (order === 'asc') {
                        return text1.localeCompare(text2);
                    }
                    else {
                        return text2.localeCompare(text1);
                    }
                }
                else {
                    if (order === 'asc') {
                        return text1 > text2 ? 1 : -1;
                    }
                    else {
                        return text1 < text2 ? 1 : -1;
                    }
                }
			}
		}
		else{
			return 0;
		}
	};
	
	/**
	* Sort text api (not used directly in the plugin)
	* @param {string} order - sort order: asc or desc
	* @param {jQuery.fn.jplist.PathModel} path - path object
	* @param {Array.<jQuery.fn.jplist.DataItemModel>} dataview - collection dataview
	* @param {string} ignore - remove characters regex expression
	* @memberOf jQuery.fn.jplist.SortService
	*/
	jQuery.fn.jplist.SortService.text = function(order, path, dataview, ignore){
	
		dataview.sort(function(dataitem1, dataitem2){
			return jQuery.fn.jplist.SortService.textHelper(dataitem1, dataitem2, order, path, ignore);
		});
	};
	
})();	