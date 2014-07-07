/**
* jPList - jQuery Data Grid Controls ##VERSION## - http://jplist.com 
* Copyright 2014 Miriam Zusin. All rights reserved.
* For non-commercial, personal, or open source projects and applications, you may use jPList for free under the terms of the GPL V3 License (https://gnu.org/licenses/gpl.html)
* If your project generates any type of income, e.g. sells products, ads, services or just represents a commercial company, you should get a commercial license at http://www.binpress.com
*/
(function(){
	'use strict';		
		
	/**
	* Path of dataitem member (for example, defined by data-path and data-type attributes within controls)
	* @param {?string} jqPath - jquery path
	* @param {?string} dataType - data type of the content in this path - text, number, datetime
	* @constructor
	*/
	jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel = function(jqPath, dataType){	
		this.jqPath = jqPath;
		this.dataType = dataType; //string, number, datetime
	};
	
	/**
	* Is current path equal to the given path
	* @param {jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel} path
	* @param {boolean} pathOnly - compare only by data-path
	* @return {boolean}
	*/
	jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel.prototype.isEqual = function(path, pathOnly){
		
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

