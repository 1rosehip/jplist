/**
* jPList - jQuery Data Grid Controls ##VERSION## - http://jplist.com 
* Copyright 2014 Miriam Zusin. All rights reserved.
* For non-commercial, personal, or open source projects and applications, you may use jPList for free  http://www.binpress.com/license/read/id/2749/app/2085
* If your project generates any type of income, e.g. sells products, ads, services or just represents a commercial company, you should get a commercial license at http://www.binpress.com
*/
(function(){
	'use strict';		
	
	/**
	* DataItem Member got the given path
	* @param {jQueryObject} $element
	* @param {jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel} path - path object	
	* @constructor 
	*/
	jQuery.fn.jplist.domain.dom.models.DataItemMemberModel = function($element, path){
		
		this.$element = $element;
		this.path = path;
		this.text = $element.text();
		this.html = $element.html();
	};
})();

