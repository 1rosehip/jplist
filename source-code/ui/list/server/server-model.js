/**
* jPList - jQuery Data Grid Controls ##VERSION## - http://jplist.com 
* Copyright 2014 Miriam Zusin. All rights reserved.
* For non-commercial, personal, or open source projects and applications, you may use jPList for free under the terms of the GPL V3 License (https://gnu.org/licenses/gpl.html)
* If your project generates any type of income, e.g. sells products, ads, services or just represents a commercial company, you should get a commercial license at http://www.binpress.com
*/
(function(){
	'use strict';		
		
	/**
	* data item viewmodel - used in server html list view/controller
	* @constructor
	* @param {jQuery.fn.jplist.domain.server.models.DataItemModel|null} dataItem
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>|null} statuses
	* @param {Object} scopeObserver - scope observer
	*/
	jQuery.fn.jplist.ui.list.models.DataItemModel = function(dataItem, statuses, scopeObserver){
		
		this.dataItem = dataItem;
		this.statuses = statuses;
		this.scopeObserver = scopeObserver;
	};
	
	/**
	* set data item
	* @param {jQuery.fn.jplist.domain.server.models.DataItemModel|null} dataItem
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>|null} statuses
	*/
	jQuery.fn.jplist.ui.list.models.DataItemModel.prototype.set = function(dataItem, statuses){
		
		//update properties
		this.dataItem = dataItem;
		this.statuses = statuses;

		//trigger change events
		this.scopeObserver.trigger(this.scopeObserver.events.modelChanged, [dataItem, statuses]);
	};
})();

