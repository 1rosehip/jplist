(function(){
	'use strict';
	
	/**
	 * build statuses
	 * @param {Object} context - jplist controller 'this' object
	 * @param {Array.<jQuery.fn.jplist.StatusDTO>} statuses
     * @param {jQuery.fn.jplist.StatusDTO} lastStatus
	 */
	var renderStatuses = function(context, statuses, lastStatus){
		
		var ajaxDataType = 'html';
		
		//update ajax data type - it could be 'html', 'xml' or 'json'
		if(context.options.dataSource && context.options.dataSource.server && context.options.dataSource.server.ajax){
		
			ajaxDataType = context.options.dataSource.server.ajax.dataType;
			
			if(!ajaxDataType){
				ajaxDataType = 'html';
			}	
		}
					
		//load data from URL
		jQuery.fn.jplist.URIService.get(
			statuses
			,context.options
			
			//OK callback
			,function(content, statuses, ajax, response){
				
				var dataitem = new jQuery.fn.jplist.DomainDataItemServerModel(content, ajaxDataType, response['responseText']);
									
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
	 * @param {jQuery.fn.jplist.DomainDataItemServerModel} dataitem - server data item
	 * @param {Array.<jQuery.fn.jplist.StatusDTO>} statuses
	 */
	var setServerData = function(context, dataitem, statuses){
	
		var status
			,pagingStatuses
			,paging;
		
		//get list of pagination statuses
		pagingStatuses = jQuery.fn.jplist.StatusesService.getStatusesByAction('paging', statuses);
		
		for(var i=0; i<pagingStatuses.length; i++){
		
			//get pagination status
			status = pagingStatuses[i];
			
			//init current page
			if(!status.data.currentPage){
				status.data.currentPage = 0;
			}
			
			//create paging object
			paging = new jQuery.fn.jplist.PaginationService(status.data.currentPage, status.data.number, dataitem.count);
			
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
	 * @param {jQuery.fn.jplist.PanelController} panel
	 * @param {jQuery.fn.jplist.History} history
	 * @return {Object}
	 */
	jQuery.fn.jplist.ServerController = function($root, options, observer, panel, history){
	
		this.options = options;
		this.observer = observer;
		this.history = history;

		this.scopeObserver = initScopeObserver(null);
		this.$root = $root;		
		this.view = null;
		this.model = null;
		
		//init model
		this.model = new jQuery.fn.jplist.DataItemServerModel(null, null, this.scopeObserver);
		
		//init view
		this.view = new jQuery.fn.jplist.ServerView($root, options, observer, this.scopeObserver, this.model, this.history);
	};
	
	/**
	 * build statuses
	 * @param {Array.<jQuery.fn.jplist.StatusDTO>} statuses
     * @param {jQuery.fn.jplist.StatusDTO} lastStatus
	 */
	jQuery.fn.jplist.ServerController.prototype.renderStatuses = function(statuses, lastStatus){
		renderStatuses(this, statuses, lastStatus);
	};
})();