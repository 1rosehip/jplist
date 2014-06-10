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
	* @param {Object} context - jplist controller 'this' object
	*/
	var initEvents = function(context){
		
		/**
		* on build statuses event
		* @param {Object} event
		* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
		*/
		context.observer.on(context.observer.events.renderStatusesEvent, function(event, statuses){
			
			//save statuses to storage according to user options (if needed)
			context.storage.save(statuses);
			
			if(context.collection){
				
				//update dataview				
				context.collection.applyStatuses(statuses);
			}	

			if(context.options.deepLinking){
				
				//if deep linking is enabled -> change url by statuses
				context.observer.trigger(context.observer.events.changeUrlDeepLinksEvent, []);
			}
		});		
	};
		
	/**
	* create collection of dataitems
	* @param {Object} context - jplist controller 'this' object
	* @return {jQuery.fn.jplist.domain.dom.collections.DataItemsCollection}
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel>} panelPaths - paths objects array
	*/
	var getCollection = function(context, panelPaths){
	
		var collection
			,$items
			,$itemsBox;
			
		$itemsBox = context.$root.find(context.options.itemsBox).eq(0);
		
		//get items inside items box
		$items = $itemsBox.find(context.options.itemPath);
		
		//create new collection
		collection = new jQuery.fn.jplist.domain.dom.collections.DataItemsCollection(context.options, context.observer, $items, panelPaths);
		
		return collection;
	};
	
	/**
	* DOM Constructor
	* @constructor
	* @param {jQueryObject} $root - jplist jquery element
	* @param {Object} options - jplist user options
	* @param {Object} observer	
	* @param {jQuery.fn.jplist.ui.panel.controllers.PanelController} panel
	* @param {jQuery.fn.jplist.app.History} history
	* @return {Object} context
	*/
	var Init = function($root, options, observer, panel, history){
	
		var context = {
			options: options
			,observer: observer
			,$root: $root
			,history: history
			,storage: new jQuery.fn.jplist.dal.Storage($root, options, observer)
			
			,collection: null
			,listView: null
		};
		
		//init list view for dom dataitems
		context.listView = new jQuery.fn.jplist.ui.list.views.DOMView(context.$root, context.options, context.observer, context.history);
		
		//init collection
		context.collection = getCollection(context, panel.paths);
		
		//init events
		initEvents(context);
				
		return jQuery.extend(this, context);
	};
	
	/**
	* DOM
	* @constructor 
	* @param {jQueryObject} $root - jplist root element
	* @param {Object} options - jplist user options
	* @param {Object} observer	
	* @param {jQuery.fn.jplist.ui.panel.controllers.PanelController} panel	
	* @param {jQuery.fn.jplist.app.History} history
	* @return {Object} - DOM controller
	*/
	jQuery.fn.jplist.ui.list.controllers.DOMController = function($root, options, observer, panel, history){
		return new Init($root, options, observer, panel, history);
	};
})();