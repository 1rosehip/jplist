(function() {
	'use strict';		
	
	/**
	* update collection dataview: filtering
	* @param {Object} context - jplist controller 'this' object
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
	*/
	var filter = function(context, statuses){
	
		var filterStatuses
			,status
			,statusesCollection
			,filterService;
		
		//init statuses collection
		statusesCollection = new jQuery.fn.jplist.app.dto.StatusesDTOCollection(context.options, context.observer, statuses);
		
		//get filter statuses		
		filterStatuses = statusesCollection['getStatusesByAction']('filter', statuses);
		
		if(filterStatuses.length > 0){

			for(var i=0; i<filterStatuses.length; i++){

				//get status
				status = filterStatuses[i];
				
				if(status && status.data && status.data.filterType){
									
					//get filter service
					filterService = jQuery.fn.jplist.app.services.DTOMapperService.filters[status.data.filterType];
					
					if(jQuery.isFunction(filterService)){
					
						//modify dataview
						context.dataview = filterService(status, context.dataview);
					}
				}
			}
			
			//trigger filter event
			context.observer.trigger(context.observer.events.listFiltered, [statuses, context]);
		}
	};	
	
	/**
	* dataview pagination
	* @param {Object} context - jplist controller 'this' object
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
	*/
	var pagination = function(context, statuses){
		
		var actionStatuses
			,paging = null
			,status
			,currentPage
			,statusesCollection;
			
		//init statuses collection
		statusesCollection = new jQuery.fn.jplist.app.dto.StatusesDTOCollection(context.options, context.observer, statuses);
		
		//get pagination statuses		
		actionStatuses = statusesCollection['getStatusesByAction']('paging', statuses);
		
		if(actionStatuses.length > 0){
		
			for(var i=0; i<actionStatuses.length; i++){
			
				//get pagination status
				status = actionStatuses[i];
				
				//init current page
				currentPage = status.data.currentPage || 0;
				
				//create paging object
				paging = new jQuery.fn.jplist.domain.dom.services.PaginationService(currentPage, status.data.number, context.dataview.length);
				
				//add paging object to the paging status
				actionStatuses[i].data.paging = paging;

				//update dataview
				context.dataview = jQuery.fn.jplist.domain.dom.services.FiltersService.pagerFilter(paging, context.dataview);
			}
			
			//trigger pagination event
			context.observer.trigger(context.observer.events.listPaginated, [statuses, context]);
		}
		
	};
	
	/**
	* sort dataview
	* @param {Object} context
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
	*/
	var sort = function(context, statuses){
		
		var actionStatuses
			,actionStatus
			,statusesCollection
			,statusesAfterGroupExpanding = []
			,tempStatus;
		
		//init statuses collection
		statusesCollection = new jQuery.fn.jplist.app.dto.StatusesDTOCollection(context.options, context.observer, statuses);
		
		//get sort statuses		
		actionStatuses = statusesCollection['getStatusesByAction']('sort', statuses);
			
        if(actionStatuses.length > 0){
		
			for(var i=0; i<actionStatuses.length; i++){
				
				actionStatus = actionStatuses[i];
				
				if(actionStatus && 
					actionStatus.data && 
					actionStatus.data['sortGroup'] && 
					jQuery.isArray(actionStatus.data['sortGroup']) && 
					actionStatus.data['sortGroup'].length > 0){
					
					for(var j=0; j<actionStatus.data['sortGroup'].length; j++){
						
						tempStatus = new jQuery.fn.jplist.app.dto.StatusDTO(
							actionStatus.name
							,actionStatus.action
							,actionStatus.type
							,actionStatus.data['sortGroup'][j]
							,actionStatus.inStorage
							,actionStatus.inAnimation
							,actionStatus.isAnimateToTop
							,actionStatus.inDeepLinking
						);
						
						statusesAfterGroupExpanding.push(tempStatus);
					}					
				}
				else{
					statusesAfterGroupExpanding.push(actionStatus);
				}
			}
			
		    jQuery.fn.jplist.domain.dom.services.SortService.doubleSort(statusesAfterGroupExpanding, context.dataview);
			
			//trigger sort event
			context.observer.trigger(context.observer.events.listSorted, [statuses, context]);
        }
	};
	
	/**
	* apply statuses
	* @param {Object} context
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
	*/
	var applyStatuses = function(context, statuses){
				
		//reset dataview
		resetDataview(context);

		//sorting
		sort(context, statuses);
		
		//filtering
		filter(context, statuses);
				
		//pagination
		pagination(context, statuses);
						
		//render list
		context.observer.trigger(context.observer.events.statusesAppliedToList, [context, statuses]);
	};
	
	/**
	* dataview toString
	* @param {Object} context
	* @return {string}
	*/
	var dataviewToString = function(context){
	
		var dataitem
			,html = ""
			,i;
		
		for(i=0; i<context.dataview.length; i++){
		
			//get dataitem
			dataitem = context.dataview[i];
			
			//add dataitem html
			html += dataitem.content;
		}
		return html;
	};
	
	/**
	* convert dataview to jquery object
	* @return {jQueryObject}
	*/
	var dataviewToJqueryObject = function(context){
		
		return jQuery(context.dataview).map(function(index, $element){
			return $element.jqElement.get();
		});
	};
	
	/**
	* convert dataitems to jquery object
	* @return {jQueryObject}
	*/
	var dataitemsToJqueryObject = function(context){
		
		return jQuery(context.dataitems).map(function(index, $element){
			return $element.jqElement.get();
		});
	};
		
	/**
	* reset dataview: dataview <- dataitems
	* @param {Object} context
	*/
	var resetDataview = function(context){
		context.dataview = jQuery.merge([], context.dataitems);
	};
		
	/**
	* find dataitem by its id in dataitems array
	* @param {Object} context	
	* @param {jQueryObject} item - item to add to dataitems array
	* @return {number} - index of dataitem in dataitems array, or -1 if not found
	*/
	var indexOf = function(context, item){
		
		var dataitem
			,index = -1
			,html1
			,html2;
		
		for(var i=0; i<context.dataitems.length; i++){
		
			//get dataitem
			dataitem = context.dataitems[i];
			
			//get outer html
			html1 = jQuery.fn.jplist.domain.dom.services.HelperService.getOuterHtml(dataitem.jqElement);
			html2 = jQuery.fn.jplist.domain.dom.services.HelperService.getOuterHtml(item);
			
			if(html1 === html2){ //dataitem.jqElement.is(item)	
				index = i;
				break;
			}
		}
		
		return index;
	};
	
	/**
	* delete dataitem from dataitems array
	* @param {Object} context	
	* @param {jQueryObject} $item - jquery element to delete
	*/
	var delDataitem = function(context, $item){
	
		var index;
		
		index = indexOf(context, $item);
			
		if(index !== -1){
		
			context.dataitems.splice(index, 1);

            //trigger event that data item was removed from the dataitems collection
	        context.observer.trigger(context.observer.events.dataItemRemoved, [$item, context.dataitems]);
		}
	};
	
	/**
	* delete dataitem collection from dataitems array
	* @param {Object} context	
	* @param {jQueryObject} items - jquery element to delete
	*/
	var delDataitems = function(context, items){
	
		items.each(function(){			
			delDataitem(context, jQuery(this));
		});
	};
	
	/**
	* add jquery item to jplist dataitems array
	* @param {Object} context
	* @param {jQueryObject} item - item to add to dataitems array
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel>} paths - paths objects array
	* @param {number} index
	*/
	var addDataItem = function(context, item, paths, index){
	
		var dataItem;
		
		//create dataitem
		dataItem = new jQuery.fn.jplist.domain.dom.models.DataItemModel(item, paths, index);
				
		//add item dataitems to array
		//context.dataitems.push(dataItem);
		
		//insert item into the given index
		context.dataitems.splice(index, 0, dataItem);

        //trigger event that data item was added to the dataitems collection
	    context.observer.trigger(context.observer.events.dataItemAdded, [dataItem, context.dataitems]);
	};
	
	/**
	* add items to collection
	* @param {Object} context - jplist controller 'this' object
	* @param {jQueryObject} $items
	* @param {number} counter
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel>} paths - paths objects array
	*/
	var addDataItemsHelper = function(context, $items, counter, paths){
		
		var $item;
		
		for(; counter<$items.length; counter++){
			
			//get item
			$item = $items.eq(counter);

			//add item to the array
			addDataItem(context, $item, paths, counter);
			
			//setTimeout is added to improve browser performance
			/* jshint -W083 */
			if(counter + 1 < $items.length && counter % 50 === 0){
				window.setTimeout(function(){
					addDataItemsHelper(context, $items, counter, paths);
				}, 0);
			}
			/* jshint +W083 */
		}		
	};
	
	/**
	* add jquery item collection to jplist dataitems array
	* @param {Object} context	
	* @param {jQueryObject} $items - items to add to dataitems array
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel>} paths - paths objects array
	*/
	var addDataItems = function(context, $items, paths){
		
		//add ittems to collection
		addDataItemsHelper(context, $items, 0, paths);
		
		//update dataview
		resetDataview(context);
	};
	
	/**
	* empty collection
	* @param {Object} context	
	*/
	var empty = function(context){
		context.dataitems = [];
		context.dataview = [];
	};
	
	/** 
	* DataItems Collection
	* @constructor 
	* @param {Object} options - jplist user options
	* @param {Object} observer
	* @return {Object} - jplist collection	
	* @param {jQueryObject} $items - initial items to add to the collection
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel>} paths - paths objects array
	*/
	var Init = function(options, observer, $items, paths){
	
		var context = {
			dataitems: []
			,dataview: []
			
            ,options: options
			,observer: observer
			,paths: paths
		};

		if($items.length > 0){
		
			//add ittems to collection
			addDataItems(context, $items, paths);		
		}
		
		//trigger collection ready event
		context.observer.trigger(context.observer.events.collectionReadyEvent, [context]);
		
		return jQuery.extend(this, context);
	};
	
	/**
	* API: apply statuses
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
	*/
	Init.prototype.applyStatuses = function(statuses){
		applyStatuses(this, statuses);
	};
	
	/**
	* API: filter dataview	
	*/
	Init.prototype.filter = function(statuses){
		filter(this, statuses);
	};
	
	/**
	* API: sort dataview	
	*/
	Init.prototype.sort = function(statuses){
		sort(this, statuses);
	};
	
	/**
	* API: dataview	pagination
	*/
	Init.prototype.pagination = function(statuses){
		pagination(this, statuses);
	};
	
	/**
	* API: convert dataview to jquery object
	* @return {jQueryObject}	
	*/
	Init.prototype.dataviewToJqueryObject = function(){
		return dataviewToJqueryObject(this);
	};
	
	/**
	* API: convert dataitems to jquery object
	* @return {jQueryObject}	
	*/
	Init.prototype.dataitemsToJqueryObject = function(){
		return dataitemsToJqueryObject(this);
	};
	
	/**
	* API: reset dataview collection with initial dataitems set	
	*/
	Init.prototype.resetDataview = function(){
		resetDataview(this);
	};
		
	/**
	* API: empty collection
	*/
	Init.prototype.empty = function(){	
		empty(this);
	};
	
	/**
	* API: convetrs jQuery element (item) to dataitem and adds it to the dataitems collection
	* @param {jQueryObject} item - jquery item to add
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel>} paths - paths objects array
	* @param {number} index	
	*/
	Init.prototype.addDataItem = function(item, paths, index){	
		addDataItem(this, item, paths, index);
	};
	
	/**
	* API: convetrs a set of jQuery elements (items) to dataitems and adds them to the dataitems collection	
	* @param {jQueryObject} items - jquery items to add
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel>} paths - paths objects array
	*/
	Init.prototype.addDataItems = function(items, paths){		
		addDataItems(this, items, paths);
	};
	
	/**
	* API: searches for jQuery element (item) in the dataitems collection and deletes it
	* @param {jQueryObject} item - jquery element (item) to delete
	*/
	Init.prototype.delDataitem = function(item){
		delDataitem(this, item);
	};
	
	/**
	* API: searches for jQuery elements (items) in the dataitems collection and deletes them
	* @param {jQueryObject} items - jquery element to delete
	*/
	Init.prototype.delDataitems = function(items){
		delDataitems(this, items);
	};
	
	/**
	* API: searches for dataitem in the collection (by id)
	* @param {jQueryObject} item - jquery element to delete
	* @return {number} - index of dataitem in dataitems array	
	*/
	Init.prototype.indexOf = function(item){
		return indexOf(this, item);
	};
	
	/**
	* API: get HTML of the collection in the current state (dataview): with the current filter, sorting etc.
	* @return {string}
	*/
	Init.prototype.dataviewToString = function(){	
		return dataviewToString(this);
	};
	
	/** 
	* DataItems Collection
	* @constructor 
	* @param {Object} options - jplist user options	
	* @param {Object} observer
	* @param {jQueryObject} $items - initial items to add to the collection
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel>} paths - paths objects array
	*/
	jQuery.fn.jplist.domain.dom.collections.DataItemsCollection = function(options, observer, $items, paths){

		var context;
		
		//call constructor
		context = new Init(options, observer, $items, paths);
		
		//properties
		this.observer = observer;
        this.options = options;

		this.dataitems = context['dataitems'];
		this.dataview = context['dataview'];
		this.paths = context['paths'];		
		
		//methods
		this.sort = context['sort'];
		this.filter = context['filter'];
		this.pagination = context['pagination'];
		this.applyStatuses = context['applyStatuses'];		
		
		this.addDataItem = context['addDataItem'];	
		this.addDataItems = context['addDataItems'];	
		
		this.resetDataview = context['resetDataview'];
		this.indexOf = context['indexOf'];	
		
		this.delDataitem = context['delDataitem'];	
		this.delDataitems = context['delDataitems'];
		this.empty = context['empty'];
		
		this.dataviewToString = context['dataviewToString'];	
		this.dataviewToJqueryObject = context['dataviewToJqueryObject'];
		this.dataitemsToJqueryObject = context['dataitemsToJqueryObject'];
	};
	
})();