;(function(){
	'use strict';
		
	/**
	* build statuses
	* @param {Object} context - jplist controller 'this' object
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
	*/
	var renderStatuses = function(context, statuses){
		
		//save statuses to storage according to user options (if needed)
		context.storage.save(statuses);
		
		if(context.collection){
			
			//update dataview				
			context.collection.applyStatuses(statuses);
			
			//render view
			context.listView.render(context.collection, statuses);
		}
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
	
		this.options = options;
		this.observer = observer;
		this.$root = $root;
		this.history = history;
		this.storage = new jQuery.fn.jplist.dal.Storage($root, options, observer);
		
		this.collection = null;
		this.itemControls = null;
		this.listView = null;
		
		//get item controls
		this.itemControls = new jQuery.fn.jplist.ui.list.collections.ItemControlCollection(
			options
			,observer
			,history
			,$root
		);
		
		//init list view for dom dataitems
		this.listView = new jQuery.fn.jplist.ui.list.views.DOMView($root, options, observer, history);
		
		//init dataitems collection
		this.collection = getCollection(this, panel.paths);		
	};	
		
	/**
	* build statuses
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
	*/
	jQuery.fn.jplist.ui.list.controllers.DOMController.prototype.renderStatuses = function(statuses){
		renderStatuses(this, statuses);
	};
	
})();