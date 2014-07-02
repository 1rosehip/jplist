/**
* @license jPList - jQuery Data Grid Controls ##VERSION## - http://jplist.com 
* Copyright 2014 Miriam Zusin. All rights reserved.
* For non-commercial, personal, or open source projects and applications, you may use jPList for free under the terms of the GPL V3 License (https://gnu.org/licenses/gpl.html)
* If your project generates any type of income, e.g. sells products, ads, services or just represents a commercial company, you should get a commercial license at http://www.binpress.com
*/
(function(){
	'use strict';	
	
	/**
	* init events
	* @param {Object} context
	*/
	var initEvents = function(context){
		
		jQuery('[data-type="save-changes"]').on('click', function(){
			
			var jsSettings = ''
				,topPanel = ''
				,bottomPanel = ''
				,template = ''
				,$this = jQuery(this)
				,$preloader;
				
			if(context.jsSettings){
				jsSettings = context.jsSettings.getValue();
			}
			
			if(context.topPanel){
				topPanel = context.topPanel.getValue();
			}
			
			if(context.bottomPanel){
				bottomPanel = context.bottomPanel.getValue();
			}
			
			if(context.handlebarsTemplate){
				template = context.handlebarsTemplate.getValue();
			}
			
			//show preloader
			$preloader = $this.next('.jp-preloader').show();
			
			jQuery.ajax({
				url: $this.attr('data-url')
				,type: 'POST'
				,data:{
					js: jsSettings
					,top: topPanel
					,bot: bottomPanel
					,template: template
					,action: 'save_changes'
				}
			}).done(function(content){
				
				//done
				
			}).fail(function(){
				
				//error ...
				
			}).always(function(){
				
				//hide preloader
				$preloader.hide();
			});
			
			//console.log(jsSettings, topPanel, bottomPanel);
		});
	};
	
	/**
	* init codemirror
	* @param {Object} context
	*/
	var initCodemirror = function(context){
				
		if(window.CodeMirror){
				
			//init js settings
			context.jsSettings = window.CodeMirror(document.getElementById('js-settings-bar-ta'), {
				mode: 'text/typescript'
				,extraKeys: {'Ctrl-Space': 'autocomplete'}
				,value: jQuery('#js-settings-bar-ta-content').html()
				,lineNumbers: true
				,lineWrapping: true
			});			
			
			//init top panel
			context.topPanel = window.CodeMirror(document.getElementById('top-bar-ta'), {
				mode: 'text/html'
				,extraKeys: {'Ctrl-Space': 'autocomplete'}
				,value: jQuery('#top-bar-ta-content').html()
				,lineNumbers: true
				,lineWrapping: true
			});
						
			//init bottom panel
			context.bottomPanel = window.CodeMirror(document.getElementById('bottom-bar-ta'), {
				mode: 'text/html'
				,extraKeys: {'Ctrl-Space': 'autocomplete'}
				,value: jQuery('#bottom-bar-ta-content').html()
				,lineNumbers: true
				,lineWrapping: true
			});
			
			//init handlebars template
			context.handlebarsTemplate = window.CodeMirror(document.getElementById('handlebars-template-bar-ta'), {
				mode: 'text/html'
				,extraKeys: {'Ctrl-Space': 'autocomplete'}
				,value: jQuery('#handlebars-template-bar-ta-content').html()
				,lineNumbers: true
				,lineWrapping: true
			});
		}
	};
	
	jQuery(document).ready(function(){
		
		var context = {
			topPanel: null
			,bottomPanel: null
			,jsSettings: null
			,handlebarsTemplate: null
		};
		
		if(window.location.href.indexOf('jplist.php') !== -1){
		
			//init codemirror
			initCodemirror(context);
			
			//init events
			initEvents(context);
		}
	});
			
})();