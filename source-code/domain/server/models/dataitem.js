/**
* jPList - jQuery Data Grid Controls ##VERSION## - http://jplist.com 
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
	* @param {string} dataType - 'html', 'json' or 'xml'
	* @param {string} responseText
	*/
	jQuery.fn.jplist.domain.server.models.DataItemModel = function(content, dataType, responseText){
		
		//init properties		
		this.content = '';
		this.dataType = dataType;
		this.count = 0;
		this.responseText = responseText;

		if(!(this.dataType)){
			this.dataType = 'html';
		}
		
		switch(this.dataType){
			
			case 'html':{
				
				var $content = jQuery(content);
				
				if($content.length > 0){
					this.content = $content.html();		
					this.count = Number($content.attr('data-count')) || 0;
				}
			}
			break;
			
			case 'json':{
				this.content = content['data'];
				this.count = content['count'];
			}
			break;
			
			case 'xml':{
				var $content = jQuery(content).find('root');
				
				this.count = Number($content.attr('count')) || 0;
				
				if(this.count > 0){
					this.content = content;
				}
				else{
					this.content = '';
				}
			}
			break;
		}
		
	};
})();

