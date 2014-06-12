/**
* @license jPList - jQuery Data Grid Controls ##VERSION## - http://jplist.com 
* Copyright 2014 Miriam Zusin. All rights reserved.
* For non-commercial, personal, or open source projects and applications, you may use jPList for free under the terms of the GPL V3 License (https://gnu.org/licenses/gpl.html)
* If your project generates any type of income, e.g. sells products, ads, services or just represents a commercial company, you should get a commercial license at http://www.binpress.com
*/
(function(){
	'use strict';		
		
	/**
	* data item - item returned from server as HTML, JSON, XML, etc.
	* @constructor
	* @param {string} content - the whole content returned from server
	*/
	jQuery.fn.jplist.domain.server.models.DataItemModel = function(content){
		
		var $content = jQuery(content);
				
		this.content = '';
		this.format = '';
		this.count = 0;		
		
		if($content.length > 0){
			this.content = $content.html();
			this.format = $content.attr('data-format');			
			this.count = Number($content.attr('data-count')) || 0;
		}
	};
})();

