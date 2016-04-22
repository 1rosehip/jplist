(function(){
	'use strict';		
		
	/**
	* data item viewmodel - used in server html list view/controller
	* @constructor
	* @param {jQuery.fn.jplist.DomainDataItemServerModel|null} dataItem
	* @param {Array.<jQuery.fn.jplist.StatusDTO>|null} statuses
	* @param {Object} scopeObserver - scope observer
	*/
	jQuery.fn.jplist.DataItemServerModel = function(dataItem, statuses, scopeObserver){
		
		this.dataItem = dataItem;
		this.statuses = statuses;
		this.scopeObserver = scopeObserver;
	};
	
	/**
	* set data item
	* @param {jQuery.fn.jplist.DomainDataItemServerModel|null} dataItem
	* @param {Array.<jQuery.fn.jplist.StatusDTO>|null} statuses
	*/
	jQuery.fn.jplist.DataItemServerModel.prototype.set = function(dataItem, statuses){
		
		//update properties
		this.dataItem = dataItem;
		this.statuses = statuses;

		//trigger change events
		this.scopeObserver.trigger(this.scopeObserver.events.modelChanged, [dataItem, statuses]);
	};
})();

