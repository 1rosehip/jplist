;(function(){
	'use strict';
		
	/**
	 * build statuses
	 * @param {Object} context - jplist controller 'this' object
	 * @param {Array.<jQuery.fn.jplist.StatusDTO>} statuses
     * @param {jQuery.fn.jplist.StatusDTO} lastStatus
     * @return {jQueryObject}
	 */
	var renderStatuses = function(context, statuses, lastStatus){

        var $dataview;

		if(context.collection){

			//update dataview				
            $dataview = context.collection.applyStatuses(statuses); //it returns $dataview
			
			//render view
            $dataview = context.listView.render(context.collection, statuses, lastStatus); //it returns $dataview
		}

        return $dataview;
	};
		
	/**
	 * create collection of dataitems
	 * @param {Object} context
     * @param {String} itemsBoxPath
     * @param {String} itemPath
	 * @param {Array.<jQuery.fn.jplist.PathModel>} panelPaths - paths objects array
     * @return {jQuery.fn.jplist.Dataitems}
	 */
	var getCollection = function(context, itemsBoxPath, itemPath, panelPaths){
	
		var collection
			,$items
			,$itemsBox;
			
		$itemsBox = context.$root.find(itemsBoxPath).eq(0);
		
		//get items inside items box
		$items = $itemsBox.find(itemPath);

		//create new collection
		collection = new jQuery.fn.jplist.Dataitems(context.observer, $items, panelPaths);

		return collection;
	};
			
	/**
	 * DOM
	 * @constructor
	 * @param {jQueryObject} $root - jplist root element
	 * @param {Object} options - jplist user options
	 * @param {Object} observer
	 * @param {Array.<jQuery.fn.jplist.PathModel>} panelPaths - paths objects array
	 * @return {Object} - DOM controller
	 */
	jQuery.fn.jplist.DOMController = function($root, options, observer, panelPaths){

		this.observer = observer;
		this.$root = $root;

		//init list view for dom dataitems
		this.listView = new jQuery.fn.jplist.DOMView(
                                        $root
                                        ,options
                                        ,observer
                                        ,options.itemsBox
                                        ,options.noResults
                                        ,options.redrawCallback
                                        ,options.effect
                                        ,options.fps);
		
		//init dataitems collection
		this.collection = getCollection(this, options.itemsBox, options.itemPath, panelPaths);
	};	
		
	/**
	 * render statuses
	 * @param {Array.<jQuery.fn.jplist.StatusDTO>} statuses
     * @param {jQuery.fn.jplist.StatusDTO} lastStatus
     * @return {jQueryObject}
	 */
	jQuery.fn.jplist.DOMController.prototype.renderStatuses = function(statuses, lastStatus){
		return renderStatuses(this, statuses, lastStatus);
	};
	
})();