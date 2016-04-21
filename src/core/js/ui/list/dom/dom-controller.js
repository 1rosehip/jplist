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
	 * @param {Object} context
     * @param {String} itemsBoxPath
     * @param {String} itemPath
	 * @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel>} panelPaths - paths objects array
     * @return {jQuery.fn.jplist.domain.dom.collections.DataItemsCollection}
	 */
	var getCollection = function(context, itemsBoxPath, itemPath, panelPaths){
	
		var collection
			,$items
			,$itemsBox;
			
		$itemsBox = context.$root.find(itemsBoxPath).eq(0);
		
		//get items inside items box
		$items = $itemsBox.find(itemPath);
		
		//create new collection
		collection = new jQuery.fn.jplist.domain.dom.collections.DataItemsCollection(context.observer, $items, panelPaths);
		
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

		this.observer = observer;
		this.$root = $root;
		
		this.collection = null;
		this.itemControls = null;
		this.listView = null;

        //init storage
        this.storage = new jQuery.fn.jplist.dal.Storage(options.storage, options.storageName, options.cookiesExpiration);
		
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
		this.collection = getCollection(this, options.itemsBox, options.itemPath, panel.paths);
	};	
		
	/**
	* render statuses
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
	*/
	jQuery.fn.jplist.ui.list.controllers.DOMController.prototype.renderStatuses = function(statuses){
		renderStatuses(this, statuses);
	};
	
})();