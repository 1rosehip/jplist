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
			,numbers = []
            ,min
            ,max
            ,shouldBeAdded;
		
		for(var i=0; i<dataview.length; i++){

            numbers = [];

			//get dataitem
			dataitem = dataview[i];			
			
			//find value by path
			pathitem = dataitem.findPathitem(path);	

			//if path is found
			if(pathitem && pathitem.$element.length > 0){

                //find all number from the path
                pathitem.$element.each(function(){

                    var num = Number(jQuery(this).text().replace(/[^-0-9\.]+/g,''));

                    if(!isNaN(num)){
                        numbers.push(num);
                    }
                });

				if(numbers.length > 0){

                    max = Math.max.apply(Math, numbers);
                    min = Math.min.apply(Math, numbers);

                    shouldBeAdded = true;

                    if(jQuery.isNumeric(prev) && prev > min){
                        shouldBeAdded = false;
                    }

                    if(jQuery.isNumeric(next) && max > next){
                        shouldBeAdded = false;
                    }

                    if(shouldBeAdded){

                        //add to list
                        resultDataview.push(dataitem);
                    }
				}
			}
		}
		
		return resultDataview;
	};
	
})();	