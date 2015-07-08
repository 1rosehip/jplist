(function(){
	'use strict';
	
	/**
	* build statuses
	* @param {Object} context - jplist controller 'this' object
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
	*/
	var renderStatuses = function(context, statuses){
		
		var ajaxDataType = 'html';
		
		//update ajax data type - it could be 'html', 'xml' or 'json'
		if(context.options.dataSource && context.options.dataSource.server && context.options.dataSource.server.ajax){
		
			ajaxDataType = context.options.dataSource.server.ajax.dataType;
			
			if(!ajaxDataType){
				ajaxDataType = 'html';
			}	
		}
		
		//save statuses to storage according to user options (if needed)
		context.storage.save(statuses);			
					
		//load data from URL
		jQuery.fn.jplist.dal.services.URIService.get(
			statuses
			,context.options
			
			//OK callback
			,function(content, statuses, ajax, response){
				
				var dataitem = new jQuery.fn.jplist.domain.server.models.DataItemModel(content, ajaxDataType, response['responseText']);
									
				//udapte statuses with server data
				setServerData(context, dataitem, statuses);
					
				//update dataitem model
				context.model.set(dataitem, statuses);						
			}
			,function(statuses){
				
				//Error callback
			}
			,function(statuses){
				
				//Always callback
			}
		);			
	};
	
	/**
	* init list observer (events object)
	* @param {jQueryObject} $root
	* @return {Object} observer
	*/
	var initScopeObserver = function($root){
		
		var observer = jQuery({});
		
		observer.$root = $root;
		
		observer.events = {			
			//viewReadyRedraw: 'viewReadyRedraw'
			modelChanged: 'modelChanged'
		};	
		
		return observer;
	};
	
	/**
	* update statuses with data from server
	* @param {Object} context
	* @param {jQuery.fn.jplist.domain.server.models.DataItemModel} dataitem - server data item
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
	*/
	var setServerData = function(context, dataitem, statuses){
	
		var status
			,pagingStatuses
			,paging
			,statusesCollection;
		
		//init statuses collection
		statusesCollection = new jQuery.fn.jplist.app.dto.StatusesDTOCollection(context.options, context.observer, statuses);
		
		//get list of pagination statuses
		pagingStatuses = statusesCollection['getStatusesByAction']('paging', statuses);
		
		for(var i=0; i<pagingStatuses.length; i++){
		
			//get pagination status
			status = pagingStatuses[i];
			
			//init current page
			if(!status.data.currentPage){
				status.data.currentPage = 0;
			}
			
			//create paging object
			paging = new jQuery.fn.jplist.domain.dom.services.PaginationService(status.data.currentPage, status.data.number, dataitem.count);
			
			//add paging object to the paging status
			pagingStatuses[i].data.paging = paging;			
		}
		
		context.observer.trigger(context.observer.events.statusesAppliedToList, [null, statuses]);
	};
			
	/**
	* Server Controller
	* @constructor 
	* @param {jQueryObject} $root - jplist root element
	* @param {Object} options - jplist user options
	* @param {Object} observer
	* @param {jQuery.fn.jplist.ui.panel.controllers.PanelController} panel
	* @param {jQuery.fn.jplist.app.History} history
	* @return {Object}
	*/
	jQuery.fn.jplist.ui.list.controllers.ServerController = function($root, options, observer, panel, history){	
	
		this.options = options;
		this.observer = observer;
		this.history = history;
		this.storage = new jQuery.fn.jplist.dal.Storage($root, options, observer);
		this.scopeObserver = initScopeObserver(null);
		this.$root = $root;		
		this.view = null;
		this.model = null;
		
		//init model
		this.model = new jQuery.fn.jplist.ui.list.models.DataItemModel(null, null, this.scopeObserver);
		
		//init view
		this.view = new jQuery.fn.jplist.ui.list.views.ServerView($root, options, observer, this.scopeObserver, this.model, this.history);
	};
	
	/**
	* build statuses
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
	*/
	jQuery.fn.jplist.ui.list.controllers.ServerController.prototype.renderStatuses = function(statuses){
		renderStatuses(this, statuses);
	};
})();