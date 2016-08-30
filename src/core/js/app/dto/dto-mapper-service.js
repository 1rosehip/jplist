/**
* DTO Mapper Service
*/
;(function(){
	'use strict';

    /**
     * DTO Mapper Service
     */
    jQuery.fn.jplist.DTOMapperService = jQuery.fn.jplist.DTOMapperService || {};

	/** 
	* DTO Mapper Service for filters
	* @type {Object}
	*/
	jQuery.fn.jplist.DTOMapperService.filters = {};
	
	// FILTERS
	
	/**
	* text filter dto mapper
	* @param {jQuery.fn.jplist.StatusDTO} status
	* @param {Array.<jQuery.fn.jplist.DataItemModel>} dataview
	* @return {Array.<jQuery.fn.jplist.DataItemModel>} dataview
	*/
	jQuery.fn.jplist.DTOMapperService.filters.TextFilter = function(status, dataview){
		
		var path = new jQuery.fn.jplist.PathModel(status.data.path, null);

		return jQuery.fn.jplist.FiltersService.textFilter(
			status.data.value
			,path
			,dataview
			,status.data.ignore
			,status.data.mode
            ,status.data.not
            ,status.data.and
            ,status.data.or
		);
	};
	
	/**
	* path filter dto mapper
	* @param {jQuery.fn.jplist.StatusDTO} status
	* @param {Array.<jQuery.fn.jplist.DataItemModel>} dataview
	* @return {Array.<jQuery.fn.jplist.DataItemModel>} dataview
	*/
	jQuery.fn.jplist.DTOMapperService.filters.path = function(status, dataview){
		
		var path = new jQuery.fn.jplist.PathModel(status.data.path, null);
		
		return jQuery.fn.jplist.FiltersService.pathFilter(
			path
			,dataview
		);
	};
	
	/**
	* inverted path filter dto mapper
	* @param {jQuery.fn.jplist.StatusDTO} status
	* @param {Array.<jQuery.fn.jplist.DataItemModel>} dataview
	* @return {Array.<jQuery.fn.jplist.DataItemModel>} dataview
	
	jQuery.fn.jplist.DTOMapperService.filters.inverted_path = function(status, dataview){
				
		return jQuery.fn.jplist.FiltersService.invertedPathFilter(
			status.data.checked_checkboxes
			,dataview
		);
	};
	*/
	
	/**
	* range filter dto mapper
	* @param {jQuery.fn.jplist.StatusDTO} status
	* @param {Array.<jQuery.fn.jplist.DataItemModel>} dataview
	* @return {Array.<jQuery.fn.jplist.DataItemModel>} dataview
	*/
	jQuery.fn.jplist.DTOMapperService.filters.range = function(status, dataview){
				
		var path = new jQuery.fn.jplist.PathModel(status.data.path, null);
		
		return jQuery.fn.jplist.FiltersService.rangeFilter(
			path
			,dataview
			,status.data.min
			,status.data.max
			,status.data.prev
			,status.data.next
		);
	};
	
	/**
	* date filter dto mapper
	* @param {jQuery.fn.jplist.StatusDTO} status
	* @param {Array.<jQuery.fn.jplist.DataItemModel>} dataview
	* @return {Array.<jQuery.fn.jplist.DataItemModel>} dataview
	*/
	jQuery.fn.jplist.DTOMapperService.filters.date = function(status, dataview){
				
		var path = new jQuery.fn.jplist.PathModel(status.data.path, null);
		
		return jQuery.fn.jplist.FiltersService.dateFilter(
			status.data['year']
			,status.data['month']
			,status.data['day']
			,path
			,dataview
			,status.data['format']
		);
	};
	
	/**
	* date range filter dto mapper
	* @param {jQuery.fn.jplist.StatusDTO} status
	* @param {Array.<jQuery.fn.jplist.DataItemModel>} dataview
	* @return {Array.<jQuery.fn.jplist.DataItemModel>} dataview
	*/
	jQuery.fn.jplist.DTOMapperService.filters.dateRange = function(status, dataview){
				
		var path = new jQuery.fn.jplist.PathModel(status.data.path, null);
		
		return jQuery.fn.jplist.FiltersService.dateRangeFilter(
			path
			,dataview
			,status.data['format']
			,status.data['prev_year']
			,status.data['prev_month']
			,status.data['prev_day']
			,status.data['next_year']
			,status.data['next_month']
			,status.data['next_day']
		);
	};
	
	/**
	* path group filter dto mapper
	* @param {jQuery.fn.jplist.StatusDTO} status
	* @param {Array.<jQuery.fn.jplist.DataItemModel>} dataview
	* @return {Array.<jQuery.fn.jplist.DataItemModel>} dataview
	*/
	jQuery.fn.jplist.DTOMapperService.filters.pathGroup = function(status, dataview){
					
		return jQuery.fn.jplist.FiltersService.pathGroupFilter(
			status.data.pathGroup
			,dataview
		);
	};

	/**
	* text group filter dto mapper
	* @param {jQuery.fn.jplist.StatusDTO} status
	* @param {Array.<jQuery.fn.jplist.DataItemModel>} dataview
	* @return {Array.<jQuery.fn.jplist.DataItemModel>} dataview
	*/
	jQuery.fn.jplist.DTOMapperService.filters.textGroup = function(status, dataview){
						
		return jQuery.fn.jplist.FiltersService.textGroupFilter(
			status.data['textGroup']
			,status.data['logic']
			,status.data['path']
			,status.data['ignoreRegex']
			,dataview
			,status.data['mode']
		);
	};

	/**
	* text filter path group dto mapper
	* @param {jQuery.fn.jplist.StatusDTO} status
	* @param {Array.<jQuery.fn.jplist.DataItemModel>} dataview
	* @return {Array.<jQuery.fn.jplist.DataItemModel>} dataview
	*/
	jQuery.fn.jplist.DTOMapperService.filters.textFilterPathGroup = function(status, dataview){
					
		return jQuery.fn.jplist.FiltersService.textFilterPathGroup(
			status.data['textAndPathsGroup']
			,status.data['ignoreRegex']
			,dataview
			,status.data['mode']
		);
	};

	// SORTING
	
	/** 
	* DTO Mapper Service for sort
	* @type {Object}
	*/
	jQuery.fn.jplist.DTOMapperService.sort = {};
	
	/**
	* text sort dto mapper
	* @param {jQuery.fn.jplist.StatusDTO} status
	* @param {jQuery.fn.jplist.DataItemModel} dataitem1
	* @param {jQuery.fn.jplist.DataItemModel} dataitem2
	* @return {number}
	*/
	jQuery.fn.jplist.DTOMapperService.sort.text = function(status, dataitem1, dataitem2){
		
		var path = new jQuery.fn.jplist.PathModel(status.data.path, status.data.type);
						
		return jQuery.fn.jplist.SortService.textHelper(
			dataitem1
			,dataitem2
			,status.data.order
			,path
			,status.data.ignore || ''
		);
	};
	
	/**
	* number sort dto mapper
	* @param {jQuery.fn.jplist.StatusDTO} status
	* @param {jQuery.fn.jplist.DataItemModel} dataitem1
	* @param {jQuery.fn.jplist.DataItemModel} dataitem2
	* @return {number}
	*/
	jQuery.fn.jplist.DTOMapperService.sort.number = function(status, dataitem1, dataitem2){
		
		var path = new jQuery.fn.jplist.PathModel(status.data.path, status.data.type);
						
		return jQuery.fn.jplist.SortService.numbersHelper(dataitem1, dataitem2, status.data.order, path);
	};
	
	/**
	* datetime sort dto mapper
	* @param {jQuery.fn.jplist.StatusDTO} status
	* @param {jQuery.fn.jplist.DataItemModel} dataitem1
	* @param {jQuery.fn.jplist.DataItemModel} dataitem2
	* @return {number}
	*/
	jQuery.fn.jplist.DTOMapperService.sort.datetime = function(status, dataitem1, dataitem2){
		
		var path = new jQuery.fn.jplist.PathModel(status.data.path, status.data.type);
						
		return jQuery.fn.jplist.SortService.datetimeHelper(
			dataitem1
			,dataitem2
			,status.data.order
			,path
			,status.data.dateTimeFormat || ''
		);
	};
})();

