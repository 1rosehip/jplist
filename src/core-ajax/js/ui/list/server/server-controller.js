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
			,paging
            ,currentPage = 0
            ,itemsPerPage = 0;
		
		//get list of pagination statuses
		pagingStatuses = jQuery.fn.jplist.StatusesService.getStatusesByAction('paging', statuses);

        if(pagingStatuses.length > 0){

            for(var i=0; i<pagingStatuses.length; i++){

                //get pagination status
                status = pagingStatuses[i];

                if(status.data){

                    if(jQuery.isNumeric(status.data.currentPage)){

                        //init current page
                        currentPage = status.data.currentPage;
                    }

                    if(jQuery.isNumeric(status.data.number) || status.data.number === 'all'){

                        //init current page
                        itemsPerPage = status.data.number;
                    }
                }
            }

            //create paging object
            paging = new jQuery.fn.jplist.PaginationService(currentPage, itemsPerPage, dataitem.count);

            //add paging object to the paging status
            for(var j=0; j<pagingStatuses.length; j++){

                if(pagingStatuses[j].data) {

                    pagingStatuses[j].data.paging = paging;
                }
            }
        }
		
		context.observer.trigger(context.observer.events.statusesAppliedToList, [null, statuses]);
	};
			
	/**
	 * Server Controller
	 * @constructor
	 * @param {jQueryObject} $root - jplist root element
	 * @param {Object} options - jplist user options
	 * @param {Object} observer
	 * @param {jQuery.fn.jplist.History} history
	 * @return {Object}
	 */
	jQuery.fn.jplist.ServerController = function($root, options, observer, history){
	
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