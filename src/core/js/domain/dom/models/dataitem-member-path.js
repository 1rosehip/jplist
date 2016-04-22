/**
* DataItem Member Path Model
*/
;(function(){
	'use strict';		
		
	/**
	* Path of dataitem member (for example, defined by data-path and data-type attributes within controls)
	* @param {?string} jqPath - jquery path
	* @param {?string} dataType - data type of the content in this path - text, number, datetime
	* @constructor
	*/
	jQuery.fn.jplist.PathModel = function(jqPath, dataType){
		this.jqPath = jqPath;
		this.dataType = dataType; //string, number, datetime
	};
	
	/**
	* Is current path equal to the given path
	* @param {jQuery.fn.jplist.PathModel} path
	* @param {boolean} pathOnly - compare only by data-path
	* @return {boolean}
	*/
	jQuery.fn.jplist.PathModel.prototype.isEqual = function(path, pathOnly){
		
		var isEqual = false;
		
		if(pathOnly){
			if(this.jqPath === path.jqPath){				
				isEqual = true;
			}
		}
		else{
			if((this.jqPath === path.jqPath) && (this.dataType === path.dataType)){				
				isEqual = true;
			}
		}		
		
		return isEqual;
	};
	
})();

