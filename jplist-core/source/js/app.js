(function(){
	'use strict';	
		
	/**
	* API: add data item to the list
	* @param {*} context
	* @param {Object} commandData
	*/
	var add = function(context, commandData){
		
		var index;
		
		if(context && 
			context.controller && 
			context.controller.collection &&
			commandData.$item){		

			index = context.controller.collection.dataitems.length;
			
			//index exists and it's in range
			if(jQuery.isNumeric(commandData.index) && commandData.index >= 0 && commandData.index <= context.controller.collection.dataitems.length){
				
				index = Number(commandData.index);
			}
			
			//add data item to the collection as last item
			context.controller.collection.addDataItem(
				commandData.$item
				,context.controller.collection.paths
				,index
			);
			
			//redraw dataview with the given statuses
			context.observer.trigger(context.observer.events.unknownStatusesChanged, [false]);
		}
	};
	
	/**
	* API: del data item from the list
	* @param {*} context
	* @param {Object} commandData
	*/
	var del = function(context, commandData){
		
		if(context && 
			context.controller && 
			context.controller.collection &&
			commandData.$item){			
			
			//add data item to the collection
			context.controller.collection.delDataitem(
				commandData.$item
			);
			
			//remove the item
			commandData.$item.remove();
			
			//redraw dataview with the given statuses
			context.observer.trigger(context.observer.events.unknownStatusesChanged, [false]);
		}
	};
	
	/**
	* API: get data items
	* @param {*} context
	* @param {Object} commandData
	*/
	var getDataItems = function(context, commandData){
		
		var dataitems = null;
		
		if(context.options && context.options.dataSource){
			switch(context.options.dataSource.type){
				
				//html data source (dom)
				case 'html':{
					
					if(context.controller && context.controller.collection){
						dataitems = context.controller.collection.dataitems;
					}
				}
				break;
				
				//server side (html) data source
				case 'server':{
					
					if(context.controller && context.controller.model && context.controller.model.dataItem){
						dataitems = context.controller.model.dataItem;
					}
				}
				break;
			}	
		}
		
		return dataitems;
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
	* perform API command
	* @param {*} context
	* @param {string} command
	* @param {Object} commandData
	*/	
	var performCommand = function(context, command, commandData){
		
		switch(command){
			
			case 'add':{			
				add(context, commandData);
			}
			break;
			
			case 'del':{
				del(context, commandData);
			}
			break;
			
			case 'getDataItems':{
				return getDataItems(context, commandData);
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
			
			//jplist API commands
			,command: 'init'
			,commandData: {}
			
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
			,hashStart: '#' //the start of the hash part, for example it may be '#!key='
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
	
		if(userOptions.command && userOptions.command !== 'init'){
						
			var context;
				
			context = this.data('jplist');
			
			if(context){				
				return performCommand(context, userOptions.command, userOptions.commandData);
			}	
		}
		else{
			return this.each(function(){
			
				var context
					,$root = jQuery(this);
				
				context = new Init(userOptions, $root);
				$root.data('jplist', context);		
			});
		}
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
	
	jQuery.fn.jplist.domain.deeplinks = jQuery.fn.jplist.domain.deeplinks || {};
	jQuery.fn.jplist.domain.deeplinks.services = jQuery.fn.jplist.domain.deeplinks.services || {};
	
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