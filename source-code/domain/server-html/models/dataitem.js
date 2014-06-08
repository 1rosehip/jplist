/**
* jQuery jPList Plugin ##VERSION## 
* Copyright 2014 Miriam Zusin. All rights reserved.
* http://jplist.com 
*/
(function(){
	'use strict';		
		
	/**
	* data item - item returned from server as HTML
	* @constructor
	* @param {string} html - the whole html returned from server
	*/
	jQuery.fn.jplist.domain.serverHTML.models.DataItemModel = function(html){
		
		var $html = jQuery(html);
				
		this.html = '';
		this.format = '';
		this.count = 0;		
		
		if($html.length > 0){
			this.html = $html.html();
			this.format = $html.attr('data-format');			
			this.count = Number($html.attr('data-count')) || 0;
		}
	};
})();

