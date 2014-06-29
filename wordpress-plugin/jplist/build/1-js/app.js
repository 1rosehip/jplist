/**
* @license jPList - jQuery Data Grid Controls ##VERSION## - http://jplist.com 
* Copyright 2014 Miriam Zusin. All rights reserved.
* For non-commercial, personal, or open source projects and applications, you may use jPList for free under the terms of the GPL V3 License (https://gnu.org/licenses/gpl.html)
* If your project generates any type of income, e.g. sells products, ads, services or just represents a commercial company, you should get a commercial license at http://www.binpress.com
*/
(function(){
	'use strict';	
	
	/**
	* init codemirror
	* @param {Object} context
	*/
	var initCodemirror = function(context){
				
		if(window.CodeMirror){
				
			//init top panel
			context.topPanel = window.CodeMirror(document.getElementById('top-bar-ta'), {
				mode: 'text/html'
				,extraKeys: {'Ctrl-Space': 'autocomplete'}
				,value: jQuery('#top-bar-ta-content').html()
			});
			
			//init bottom panel
			context.bottomPanel = window.CodeMirror(document.getElementById('bottom-bar-ta'), {
				mode: 'text/html'
				,extraKeys: {'Ctrl-Space': 'autocomplete'}
				,value: jQuery('#bottom-bar-ta-content').html()
			});
		}
	};
	
	jQuery(document).ready(function(){
		
		var context = {
			topPanel: null
			,bottomPanel: null
		};
		
		//init codemirror
		initCodemirror(context);
	});
			
})();