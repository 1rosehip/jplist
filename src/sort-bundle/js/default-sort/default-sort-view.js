(function(){//+
	'use strict';		

	/**
	* Get control status
	* @param {Object} context
	* @param {boolean} isDefault - if true, get default (initial) control status; else - get current control status
	* @return {jQuery.fn.jplist.StatusDTO}
	*/
	var getStatus = function(context, isDefault){
		
		var data
			,status;

		data = new jQuery.fn.jplist.controls.DefaultSortDTO(context.$control.attr('data-path')
																			,context.$control.attr('data-type')
																			,context.$control.attr('data-order')
																			,context.$control.attr('data-datetime-format')
																			,context.$control.attr('data-ignore'));
		
		status = new jQuery.fn.jplist.StatusDTO(
			context.name
			,context.action
			,context.type
			,data
			,context.inStorage
			,context.inAnimation
			,context.isAnimateToTop
			,context.inDeepLinking
		);
		
		return status;			
	};

	/**
	* Get control paths
	* @param {Object} context
	* @param {Array.<jQuery.fn.jplist.PathModel>} paths
	*/
	var getPaths = function(context, paths){
	
		var jqPath
			,dataType
			,path;

        //init vars
        jqPath = context.$control.attr('data-path');
        dataType = context.$control.attr('data-type');

        //init path
        if(jqPath){

            //init path
            path = new jQuery.fn.jplist.PathModel(jqPath, dataType);
            paths.push(path);
        }
	};
	
	/** 
	* 'Default sort' control - used instead of 'sort dropdown' control, to define the inital sort order.
	* @constructor
	* @param {Object} context
	*/
	var Init = function(context){		
		return jQuery.extend(this, context);
	};
		
	/**
	* Get control status
	* @param {boolean} isDefault - if true, get default (initial) control status; else - get current control status
	* @return {jQuery.fn.jplist.StatusDTO}
	*/
	Init.prototype.getStatus = function(isDefault){
		return getStatus(this, isDefault);
	};
	
	/**
	* Get Paths
	* @param {Array.<jQuery.fn.jplist.PathModel>} paths
	*/
	Init.prototype.getPaths = function(paths){
		getPaths(this, paths);
	};
	
	/** 
	* 'Default sort' control - used instead of 'sort dropdown' control, to define the inital sort order.
	* @constructor
	* @param {Object} context	
	*/
	jQuery.fn.jplist.controls.DefaultSort = function(context){
		return new Init(context);
	};

	/**
	* static control registration
	*/
	jQuery.fn.jplist.controlTypes['default-sort'] = {
		className: 'DefaultSort'
		,options: {}
	};	
		
})();

