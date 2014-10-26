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

