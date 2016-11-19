(function(){
	'use strict';	
	
	/**
	* get control paths
	* @param {Object} context
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel>} paths
	*/
	var getPaths = function(context, paths){

		var dataType = null
			,path = null;

		path = new jQuery.fn.jplist.PathModel(context.params.autocompleteParams.dataPath, dataType);

		paths.push(path);
	};
	
	/**
	* init scope observer (events object)
	* @param {Object} context
	* @return {Object} observer
	*/
	var initScopeObserver = function(context){
		
		var observer = jQuery({});
		
		observer.$root = context.$control;
		
		observer.events = {
			inputValueChanged: '1'
			,DOMDataLoaded: '2'
			,ServerDataLoaded: '3'
			,onSelect: '4'
		};	
		
		return observer;
	};
	
	/** 
	* Autocomplete Control
	* @constructor
	* @param {Object} context
	*/
	var Init = function(context){

		context.params = {
			
			scopeObserver: null
			,dataSource: null
			,view: null
			
			//autocomplete data attributes
			,autocompleteParams: {
				dataPath: context.$control.attr('data-path')
				
				,ignore: context.$control.attr('data-ignore') || '[~!@#$%^&*()+=`\'"\/\\_ ]+' //[^a-zA-Z0-9]+ not letters/numbers: [~!@#$%^&*\(\)+=`\'"\/\\_]+	
				
				//min number of characters to start suggestions
				,minChars: Number(context.$control.attr('data-minchars')) || 0
				
				//if match case
				//,matchCase: Boolean(context.$control.attr('data-matchcase')) || false

				//if match fom start
				//,matchFromStart: Boolean(context.$control.attr('data-matchfromstart')) || false
				
				//max number of suggestions to show
				,maxItems: Number(context.$control.attr('data-maxitems')) || 5
				
				//render function for server data sources
				,render: context.$control.attr('data-render')
				
				//callback
				,onSuggest: context.$control.attr('data-onsuggest')
			}	
		};
		
		//init scope observer
		context.params.scopeObserver = initScopeObserver(context);
		
		//init data source
		context.params.dataSource = new jQuery.fn.jplist.controls.AutocompleteDataSource(
			context.params.scopeObserver
			,context.$root
			,context.options
			,context.params.autocompleteParams
		);
		
		//init view
		context.params.view = new jQuery.fn.jplist.controls.AutocompleteView(
			context.$control
			,context.params.scopeObserver
			,context.params.autocompleteParams
		);
				
		return jQuery.extend(this, context);
	};
	
	/**
	* Get Paths
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel>} paths
	*/
	Init.prototype.getPaths = function(paths){
		getPaths(this, paths);
	};
	
	/** 
	* Autocomplete
	* @constructor
	* @param {Object} context
	*/
	jQuery.fn.jplist.controls.Autocomplete = function(context){
		return new Init(context);
	};

	/**
	* static control registration
	*/
	jQuery.fn.jplist.controlTypes['autocomplete'] = {
		className: 'Autocomplete'
		,options: {}
	};
})();	