/**
* @license jPList - jQuery Data Grid Controls ##VERSION## - http://jplist.com 
* Copyright 2014 Miriam Zusin. All rights reserved.
* For non-commercial, personal, or open source projects and applications, you may use jPList for free under the terms of the GPL V3 License (https://gnu.org/licenses/gpl.html)
* If your project generates any type of income, e.g. sells products, ads, services or just represents a commercial company, you should get a commercial license at http://www.binpress.com
*/
(function(){
	'use strict';	
	
	/**
	* init observer (events object)
	* @param {jQueryObject} $root
	* @return {Object} observer
	*/
	var initObserver = function($root){
		
		var observer = jQuery({});
		
		observer.$root = $root;
		
		observer.events = {
			
			//events
			renderStatusesEvent: '1' //event from panel to controller: ask to rebuild item container's html
			,setStatusesEvent: '2' //event from controller to panel after html rebuild
			,forceRenderStatusesEvent: '3' //event to panel -> panel sends build statuses event
			,restoreEvent: '4' //event to panel -> restore panel from event data (statuses array) and render html
			,statusEvent: '5' //event to panel -> get all statuses and merge them with the given status, then render html	
						
			//additional action events
			,sortEvent: '6' //event from controller -> sort action occurred
			,filterEvent: '7' //event from controller -> filter action occurred
			,paginationEvent: '8' //event from controller -> pagination action occurred
			
			//deep linking events
			,changeUrlDeepLinksEvent: '9' //event to panel -> get deep links from all panel controls and change url
			,setDeepLinksEvent: '10' //event to panel -> set panel controls statuses by their deep links

            //collection events
            ,addItemEvent: '11' //event from collection - items is added to collection
            ,delItemEvent: '12' //event from collection - items is deleted from collection
            ,collectionReadyEvent: '13' //event from controller - when collection is ready
			
			//animation events
			,animationStartEvent: '14'
			,animationStepEvent: '15'
			,animationCompleteEvent: '16'

			,renderList: '17'
		};	
		
		return observer;
	};
	
	/**
	* init data source
	* @param {Object} context
	*/
	var initDataSource = function(context){

		//if data source option doesn't exist -> it should be 'html'
		context.options.dataSource = context.options.dataSource || {};
		context.options.dataSource.type = context.options.dataSource.type || 'html';
		
		//debug info
		jQuery.fn.jplist.info(context.options, 'Data Source Type: ', context.options.dataSource.type);
		
		//check data source option:
		switch(context.options.dataSource.type){
		
			//html data source (dom)
			case 'html':{
				
				var dom = new jQuery.fn.jplist.ui.list.controllers.DOMController(
					context.$root
					,context.options
					,context.observer
					,context.panel
					,context.history
				);
			}
			break;
			
			//server side (html) data source
			case 'server':{
				
				//debug info
				jQuery.fn.jplist.info(context.options, 'Data Source: ', context.options.dataSource);
		
				var server = new jQuery.fn.jplist.ui.list.controllers.ServerHTML(
					context.$root
					,context.options
					,context.observer
					,context.panel
					,context.history
				);
			}
			break;
		}
		
		
	};
	
	/**
	* trigger initial event
	* @param {Object} context
	*/
	var triggerInitialEvent = function(context){
		
		var storageStatuses = []
			,isStorageEnabled = false;
		
		//if deep links options is enabled
		if(context.options.deepLinking){
			
			//debug info
			jQuery.fn.jplist.info(context.options, 'Deep linking enabled', '');
				
			//try restore panel state from query string
			context.observer.trigger(context.observer.events.setDeepLinksEvent, []);
		}
		else{		
		
			isStorageEnabled = (context.options.storage === 'cookies') || ((context.options.storage === 'localstorage') && jQuery.fn.jplist.dal.services.LocalStorageService.supported());
			
			//check storage
			if(isStorageEnabled){
			
				//debug info
				jQuery.fn.jplist.info(context.options, 'Storage enabled: ', context.options.storage);
			
				if(context.options.storage === 'cookies'){
					
					//restore statuses from storage
					storageStatuses = jQuery.fn.jplist.dal.services.CookiesService.restoreCookies(context.options.storageName);
				}
				
				if((context.options.storage === 'localstorage') && jQuery.fn.jplist.dal.services.LocalStorageService.supported()){
					
					//restore statuses from storage
					storageStatuses = jQuery.fn.jplist.dal.services.LocalStorageService.restore(context.options.storageName);
				}
				
				//send redraw event
				if(storageStatuses.length > 0){
				
					context.observer.trigger(context.observer.events.restoreEvent, [storageStatuses]);
				}
				else{
					//send panel redraw event
					context.observer.trigger(context.observer.events.forceRenderStatusesEvent, [true]);
				}
			}
			else{			
				//send panel redraw event
				context.observer.trigger(context.observer.events.forceRenderStatusesEvent, [true]);
			}
		}		
	};
	
	/** 
	* jplist constructor 
	* @param {Object} userOptions - jplist user options
	* @param {jQueryObject} $root - jplist container
	* @constructor 
	*/
	var Init = function(userOptions, $root){
		
		var context = {
			controller: null
			,observer: initObserver($root)
			,events: null
			,panel: null
			,$root: $root
		};
		
		context.options = jQuery.extend(true, {	
		
			//enable/disable logging information
			debug: false
			
			//main options
			,itemsBox: '.list' //items container jQuery path
			,itemPath: '.list-item' //jQuery path to the item within the items container
			,panelPath: '.panel' //panel jQuery path
			,noResults: '.jplist-no-results' //'no reaults' section jQuery path
			,redrawCallback: ''
			,iosBtnPath: '.jplist-ios-button'
			
			//animate to top - enabled by data-control-animate-to-top="true" attribute in control
			,animateToTop: 'html, body'
			,animateToTopDuration: 0 //in milliseconds (1000 ms = 1 sec)
			
			//animation effects
			,effect: '' //'', 'fade'
			,duration: 300			
			,fps: 24			
			
			//save plugin state with storage
			,storage: '' //'', 'cookies', 'localstorage'			
			,storageName: 'jplist'
			,cookiesExpiration: -1 //cookies expiration in minutes (-1 = cookies expire when browser is closed)
			
			//deep linking
			,deepLinking: false
			,delimiter0: ':' //this delimiter is placed after the control name 
			,delimiter1: '|' //this delimiter is placed between key-value pairs
			,delimiter2: '~' //this delimiter is placed between multiple value of the same key
			,delimiter3: '!' //additional delimiter
			
			//history
			,historyLength: 10
			
			//data source
			,dataSource: {
				
				type: 'html' //'html', 'server'
				
				//data source server side
				,server: {
				
					//ajax settings
					ajax:{
						url: 'server.php'
						,dataType: 'html'
						,type: 'POST'
						//,cache: false
					}
					,serverOkCallback: null
					,serverErrorCallback: null
				}
					
				//render function for json + templates like handlebars, xml + xslt etc.
				,render: null
			}
			
			//panel controls
			,controlTypes: {
				
				'default-sort':{
					className: 'DefaultSort'
					,options: {}
				}
				
				,'drop-down':{
					className: 'Dropdown'
					,options: {}
				}
				
				,'pagination-info':{
					className: 'PaginationInfo'
					,options: {}
				}

                ,'counter':{
					className: 'Counter'
					,options: {
						ignore: '[~!@#$%^&*()+=`\'"\/\\_]+' //[^a-zA-Z0-9]+ not letters/numbers: [~!@#$%^&*\(\)+=`\'"\/\\_]+
					}
				}
								
				,'pagination':{
					className: 'Pagination'
					,options: {
					
						//paging
						range: 7
						,jumpToStart: false
						
						//arrows
						,prevArrow: '&lsaquo;'
						,nextArrow: '&rsaquo;'
						,firstArrow: '&laquo;'
						,lastArrow: '&raquo;'
					}
				}	
				
				,'reset':{
					className: 'Reset'
					,options: {}
				}
				
				,'select':{
					className: 'Select'
					,options: {}
				}
				
				,'textbox':{
					className: 'Textbox' 
					,options: {
						eventName: 'keyup'
						,ignore: '[~!@#$%^&*()+=`\'"\/\\_]+' //[^a-zA-Z0-9]+ not letters/numbers: [~!@#$%^&*\(\)+=`\'"\/\\_]+							
					}
				}
				
				,'views':{
					className: 'Views'
					,options: {}
				}
				
				,'checkbox-group-filter':{
					className: 'CheckboxGroupFilter'
					,options: {}
				}

                ,'checkbox-text-filter':{
					className: 'CheckboxTextFilter'
					,options: {
                        ignore: '' //regex for the characters to ignore, for example: [^a-zA-Z0-9]+
                    }
				}
				
				,'button-filter':{
					className: 'ButtonFilter'
					,options: {}
				}

                ,'button-filter-group':{
					className: 'ButtonFilterGroup'
					,options: {}
				}

                ,'button-text-filter':{
					className: 'ButtonTextFilter'
					,options: {
                        ignore: '[~!@#$%^&*()+=`\'"\/\\_]+' //[^a-zA-Z0-9]+ not letters/numbers: [~!@#$%^&*\(\)+=`\'"\/\\_]+
                    }
				}
				
				,'button-text-filter-group':{
					className: 'ButtonTextFilterGroup'
					,options: {
                        ignore: '[~!@#$%^&*()+=`\'"\/\\_]+' //[^a-zA-Z0-9]+ not letters/numbers: [~!@#$%^&*\(\)+=`\'"\/\\_]+
                    }
				}
				
				,'radio-buttons-filters':{
					className: 'RadioButtonsFilter'
					,options: {}
				}

                ,'range-filter':{
					className: 'RangeSliderToggleFilter'
					,options: {}
				}
				
				,'back-button':{
					className: 'BackButton'
					,options: {}
				}
				
				,'preloader':{
					className: 'Preloader'
					,options: {}
				}
			}
			
		}, userOptions);
		
		//init events - used to save last status
		context.history = new jQuery.fn.jplist.app.History(context.$root, context.options, context.observer);
				
		//init panel
		context.panel = new jQuery.fn.jplist.ui.panel.controllers.PanelController($root, context.options, context.history, context.observer);
		
		//init data source
		initDataSource(context);	

		//trigger initial event
		triggerInitialEvent(context);
		
		return jQuery.extend(this, context); 
	};
	
	/** 
	* jPList main contructor
	* @param {Object} userOptions - jplist user options
	*/
	jQuery.fn.jplist = function(userOptions){
	
		return this.each(function(){
			var context = new Init(userOptions, jQuery(this));
			jQuery(this).data('jplist', context);
		});
	};
	
	//NAMESPACES
	
	/**
	* Application Layer Namespace
	*/
	jQuery.fn.jplist.app = jQuery.fn.jplist.app || {};
	jQuery.fn.jplist.app.services = jQuery.fn.jplist.app.services || {};
	jQuery.fn.jplist.app.services.DTOMapperService = jQuery.fn.jplist.app.services.DTOMapperService || {};
	jQuery.fn.jplist.app.dto = jQuery.fn.jplist.app.dto || {};
	
	/**
	* Domain Layer Namespace
	* @type {Object}
	* @namespace
	*/
	jQuery.fn.jplist.domain = jQuery.fn.jplist.domain || {};
	
	jQuery.fn.jplist.domain.dom = jQuery.fn.jplist.domain.dom || {};
	jQuery.fn.jplist.domain.dom.models = jQuery.fn.jplist.domain.dom.models || {};
	jQuery.fn.jplist.domain.dom.collections = jQuery.fn.jplist.domain.dom.collections || {};
	jQuery.fn.jplist.domain.dom.services = jQuery.fn.jplist.domain.dom.services || {};
	jQuery.fn.jplist.domain.dom.services.FiltersService = jQuery.fn.jplist.domain.dom.services.FiltersService || {};
	jQuery.fn.jplist.domain.dom.services.SortService = jQuery.fn.jplist.domain.dom.services.SortService || {};
	jQuery.fn.jplist.domain.dom.services.pagination = jQuery.fn.jplist.domain.dom.services.pagination || {};
	
	jQuery.fn.jplist.domain.server = jQuery.fn.jplist.domain.server || {};
	jQuery.fn.jplist.domain.server.models = jQuery.fn.jplist.domain.server.models || {};
	
	/**
	* Infrastructure Layer Namespace
	* @type {Object}
	* @namespace
	*/
	jQuery.fn.jplist.dal = jQuery.fn.jplist.dal || {};
	jQuery.fn.jplist.dal.services = jQuery.fn.jplist.dal.services || {};
	
	/**
	* Presentation Layer Namespace
	* @type {Object}
	* @namespace
	*/
	jQuery.fn.jplist.ui = jQuery.fn.jplist.ui || {};	
	jQuery.fn.jplist.ui.list = jQuery.fn.jplist.ui.list || {};
	jQuery.fn.jplist.ui.list.models = jQuery.fn.jplist.ui.list.models || {};
	jQuery.fn.jplist.ui.list.controllers = jQuery.fn.jplist.ui.list.controllers || {};
	jQuery.fn.jplist.ui.list.views = jQuery.fn.jplist.ui.list.views || {};	
	jQuery.fn.jplist.ui.controls = jQuery.fn.jplist.ui.controls || {};
	jQuery.fn.jplist.ui.statuses = jQuery.fn.jplist.ui.statuses || {};
	jQuery.fn.jplist.ui.panel = jQuery.fn.jplist.ui.panel || {};
	jQuery.fn.jplist.ui.panel.controllers = jQuery.fn.jplist.ui.panel.controllers || {};
	jQuery.fn.jplist.ui.panel.collections = jQuery.fn.jplist.ui.panel.collections || {};
			
})();