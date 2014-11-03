(function(){
	'use strict';	
		
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
				
				context.controller = new jQuery.fn.jplist.ui.list.controllers.DOMController(
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
		
				context.controller = new jQuery.fn.jplist.ui.list.controllers.ServerController(
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
	* jplist constructor 
	* @param {Object} userOptions - jplist user options
	* @param {jQueryObject} $root - jplist container
	* @constructor 
	*/
	var Init = function(userOptions, $root){
		
		var context = {
			observer: null
			,panel: null
			,controller: null
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
			
		}, userOptions);
		
		//init pubsub
		context.observer = new jQuery.fn.jplist.app.events.PubSub(context.$root, context.options);
				
		//init events - used to save last status
		context.history = new jQuery.fn.jplist.app.History(context.$root, context.options, context.observer);
				
		//init panel
		context.panel = new jQuery.fn.jplist.ui.panel.controllers.PanelController($root, context.options, context.history, context.observer);
		
		//init data source
		initDataSource(context);	

		//trigger initial event
		context.observer['trigger'](context.observer.events.init, []);
		
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
	
	//PLUGINS AND CONTROLS REGISTRATION ----------------------------
	jQuery.fn.jplist.controlTypes = {};
	jQuery.fn.jplist.itemControlTypes = {};
	jQuery.fn.jplist.settings = {};
	
	//NAMESPACES ---------------------------------------------------
	
	/**
	* Application Layer Namespace
	*/
	jQuery.fn.jplist.app = jQuery.fn.jplist.app || {};
	jQuery.fn.jplist.app.services = jQuery.fn.jplist.app.services || {};
	jQuery.fn.jplist.app.services.DTOMapperService = jQuery.fn.jplist.app.services.DTOMapperService || {};
	jQuery.fn.jplist.app.dto = jQuery.fn.jplist.app.dto || {};
	jQuery.fn.jplist.app.events = jQuery.fn.jplist.app.events || {};
	
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
	jQuery.fn.jplist.ui.list.collections = jQuery.fn.jplist.ui.list.collections || {};
	jQuery.fn.jplist.ui.list.views = jQuery.fn.jplist.ui.list.views || {};	
	jQuery.fn.jplist.ui.controls = jQuery.fn.jplist.ui.controls || {};
	jQuery.fn.jplist.ui.itemControls = jQuery.fn.jplist.ui.itemControls || {};
	jQuery.fn.jplist.ui.statuses = jQuery.fn.jplist.ui.statuses || {};
	jQuery.fn.jplist.ui.panel = jQuery.fn.jplist.ui.panel || {};
	jQuery.fn.jplist.ui.panel.controllers = jQuery.fn.jplist.ui.panel.controllers || {};
	jQuery.fn.jplist.ui.panel.collections = jQuery.fn.jplist.ui.panel.collections || {};
			
})();