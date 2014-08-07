/**
* jPList - jQuery Data Grid Controls ##VERSION## - http://jplist.com 
* Copyright 2014 Miriam Zusin. All rights reserved.
* For non-commercial, personal, or open source projects and applications, you may use jPList for free  http://www.binpress.com/license/read/id/2749/app/2085
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
		
		var $content;
		
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
				
				$content = jQuery(content);
				
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
				$content = jQuery(content).find('root');
				
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

