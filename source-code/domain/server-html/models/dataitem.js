/**
* @license jPList - jQuery Data Grid Controls ##VERSION## - http://jplist.com 
* Copyright 2014 Miriam Zusin. All rights reserved.
* For non-commercial, personal, or open source projects and applications, you may use jPList for free under the terms of the GPL V3 License (https://gnu.org/licenses/gpl.html)
* If your project generates any type of income, e.g. sells products, ads, services or just represents a commercial company, you should get a commercial license at http://www.binpress.com
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

