/**
* @license jPList - jQuery Data Grid Controls ##VERSION## - http://jplist.com 
* Copyright 2014 Miriam Zusin. All rights reserved.
* For non-commercial, personal, or open source projects and applications, you may use jPList for free under the terms of the GPL V3 License (https://gnu.org/licenses/gpl.html)
* If your project generates any type of income, e.g. sells products, ads, services or just represents a commercial company, you should get a commercial license at http://www.binpress.com
*/
(function(){
	'use strict';
	
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
	};
		
	/**
	* init events
	* @param {Object} context - jplist controller 'this' object
	*/
	var initEvents = function(context){
	
		/**
		* on view ready
		* @param {Object} event
		* @param {Object} obj - other context
		* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
		*/
		context.observer.on(context.observer.events.renderList, function(event, obj, statuses){
			
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
				,function(content, statuses){
					
					var dataitem = new jQuery.fn.jplist.domain.server.models.DataItemModel(content, ajaxDataType);
										
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
			
		});		
	};
	
	/**
	* server constructor
	* @constructor 
	* @param {jQueryObject} $root - jplist jquery element
	* @param {Object} options - jplist user options
	* @param {Object} observer
	* @param {jQuery.fn.jplist.ui.panel.controllers.PanelController} panel
	* @param {jQuery.fn.jplist.app.History} history
	* @return {Object}
	*/
	var Init = function($root, options, observer, panel, history){
	
		var context = {
			options: options
			,observer: observer
			,history: history
			,storage: new jQuery.fn.jplist.dal.Storage($root, options, observer)
			,scopeObserver: initScopeObserver(null)
			,$root: $root			
			,view: null
			,model: null
		};
		
		//init model
		context.model = new jQuery.fn.jplist.ui.list.models.DataItemModel(null, null, context.scopeObserver);
		
		//init view
		context.view = new jQuery.fn.jplist.ui.list.views.ServerView($root, options, observer, context.scopeObserver, context.model, context.history);
		
		//init events
		initEvents(context);
				
		return jQuery.extend(this, context);
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
		return new Init($root, options, observer, panel, history);
	};
})();