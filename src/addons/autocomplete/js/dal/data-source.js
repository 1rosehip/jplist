;(function(){
	'use strict';	
		
	/**
	* get data - DOM data source	
	* @param {Object} context
	* @param {string} inputValue
	*/
	var getDataDOM = function(context, inputValue){
		
		var dataitems = null
			,dataview = []
			,path;

        //add item to jplist collection
        dataitems = context.$root.jplist({
            command: 'getDataItems'
            ,commandData: {}
        });

        if(jQuery.trim(inputValue) && dataitems){
			
			path = new jQuery.fn.jplist.PathModel(context.params.dataPath, null);
			
			dataview = jQuery.fn.jplist.FiltersService.textFilter(inputValue, path, dataitems, context.params.ignore, 'contains');
			
			if(dataview && dataview.length > context.params.maxItems){
				dataview.splice(context.params.maxItems, dataview.length - context.params.maxItems);
			}
		}
		
		if(!dataview){
			dataview = [];
		}
		
		//draw dropdown html
		context.scopeObserver.trigger(context.scopeObserver.events.DOMDataLoaded, [dataview]);

	};
	
	/**
	* get data - DOM data source	
	* @param {Object} context
	* @param {string} inputValue
	*/
	var getServerData = function(context, inputValue){
		
		var ajaxDataType = 'html'
			,statuses = []
			,filterStatus
			,paginaStatus;
			
		if(jQuery.trim(inputValue)){
		
			//update ajax data type - it could be 'html', 'xml' or 'json'
			if(context.options.dataSource && context.options.dataSource.server && context.options.dataSource.server.ajax){
			
				ajaxDataType = context.options.dataSource.server.ajax.dataType;
				
				if(!ajaxDataType){
					ajaxDataType = 'html';
				}	
			}
			
			filterStatus = {
				action: 'filter'
				,type: 'autocomplete'
				,data:{
					path: context.params.dataPath
					,ignore: context.params.ignore
					,value: inputValue
					,minChars: context.params.minChars
					,maxItems: context.params.maxItems
				}
			};
			
			paginaStatus = {
				
				action: 'paging'
				,type: 'placeholder'
				,data: {
					number: context.params.maxItems
					,currentPage: 0
				}
			};
			
			statuses.push(filterStatus);
			statuses.push(paginaStatus);
			
			//load data from URL
			jQuery.fn.jplist.dal.services.URIService.get(
				statuses
				,context.options
				
				//OK callback
				,function(content, statuses, ajax, response){
					
					var dataitem = new jQuery.fn.jplist.domain.server.models.DataItemModel(content, ajaxDataType, response['responseText']);
					
					//draw html..
					context.scopeObserver.trigger(context.scopeObserver.events.ServerDataLoaded, [dataitem, inputValue]);									
				}
				,function(statuses){				
					//Error callback
				}
				,function(statuses){				
					//Always callback
				}
			);	
		}
		else{
			context.scopeObserver.trigger(context.scopeObserver.events.ServerDataLoaded, [null, inputValue]);
		}		
	};
	
	/**
	* get data
	* @param {Object} context
	* @param {string} inputValue

	var getData = function(context, inputValue){

		if(context.options && context.options.dataSource){

			switch(context.options.dataSource.type){
				
				//DOM data source
				case 'html':{
					getDataDOM(context, inputValue);
				}
				break;
				
				//server side (html) data source
				case 'server':{
					getServerData(context, inputValue);
				}
				break;
			}
		}
	};*/
	
	/**
	* init events
	* @param {Object} context
	*/
	var initEvents = function(context){
	
		//on get data events
		//@param {Object} e
		//@param {string} inputValue
		context.scopeObserver.on(context.scopeObserver.events.inputValueChanged, function(e, inputValue){

            getDataDOM(context, inputValue);
		});
		
	};
	
	/** 
	* Autocomplete Data Source
	* @constructor
	* @param {Object} scopeObserver
	* @param {jQueryObject} $root
	* @param {Object} options
	* @param {Object} autocompleteParams
	*/
	var Init = function(scopeObserver, $root, options, autocompleteParams){
			
		var context = {
			scopeObserver: scopeObserver
			,$root: $root
			,options: options
			,params: autocompleteParams
		};
		
		//init events
		initEvents(context);
		
		return jQuery.extend(this, context);
	};

	/** 
	* Autocomplete Data Source
	* @constructor
	* @param {Object} scopeObserver
	* @param {jQueryObject} $root
	* @param {Object} options
	* @param {Object} autocompleteParams
	*/
	jQuery.fn.jplist.controls.AutocompleteDataSource = function(scopeObserver, $root, options, autocompleteParams){
		return new Init(scopeObserver, $root, options, autocompleteParams);
	};	
	
})();	