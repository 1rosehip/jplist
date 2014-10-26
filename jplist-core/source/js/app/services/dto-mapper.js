(function(){
	'use strict';		
	
	/** 
	* DTO Mapper Service for filters
	* @type {Object}
	*/
	jQuery.fn.jplist.app.services.DTOMapperService.filters = {};
	
	// FILTERS
	
	/**
	* text filter dto mapper
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>} dataview
	* @return {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>} dataview
	*/
	jQuery.fn.jplist.app.services.DTOMapperService.filters.TextFilter = function(status, dataview){
		
		var path = new jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel(status.data.path, null); 
		
		return jQuery.fn.jplist.domain.dom.services.FiltersService.textFilter(
			status.data.value
			,path
			,dataview
			,status.data.ignore
		);
	};
	
	/**
	* path filter dto mapper
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>} dataview
	* @return {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>} dataview
	*/
	jQuery.fn.jplist.app.services.DTOMapperService.filters.path = function(status, dataview){
		
		var path = new jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel(status.data.path, null); 
		
		return jQuery.fn.jplist.domain.dom.services.FiltersService.pathFilter(
			path
			,dataview
		);
	};
	
	/**
	* inverted path filter dto mapper
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>} dataview
	* @return {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>} dataview
	
	jQuery.fn.jplist.app.services.DTOMapperService.filters.inverted_path = function(status, dataview){
				
		return jQuery.fn.jplist.domain.dom.services.FiltersService.invertedPathFilter(
			status.data.checked_checkboxes
			,dataview
		);
	};
	*/
	
	/**
	* range filter dto mapper
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>} dataview
	* @return {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>} dataview
	*/
	jQuery.fn.jplist.app.services.DTOMapperService.filters.range = function(status, dataview){
				
		var path = new jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel(status.data.path, null); 
		
		return jQuery.fn.jplist.domain.dom.services.FiltersService.rangeFilter(
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
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>} dataview
	* @return {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>} dataview
	*/
	jQuery.fn.jplist.app.services.DTOMapperService.filters.date = function(status, dataview){
				
		var path = new jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel(status.data.path, null); 
		
		return jQuery.fn.jplist.domain.dom.services.FiltersService.dateFilter(
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
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>} dataview
	* @return {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>} dataview
	*/
	jQuery.fn.jplist.app.services.DTOMapperService.filters.dateRange = function(status, dataview){
				
		var path = new jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel(status.data.path, null); 
		
		return jQuery.fn.jplist.domain.dom.services.FiltersService.dateRangeFilter(
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
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>} dataview
	* @return {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>} dataview
	*/
	jQuery.fn.jplist.app.services.DTOMapperService.filters.pathGroup = function(status, dataview){
					
		return jQuery.fn.jplist.domain.dom.services.FiltersService.pathGroupFilter(
			status.data.pathGroup
			,dataview
		);
	};

	/**
	* text group filter dto mapper
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>} dataview
	* @return {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>} dataview
	*/
	jQuery.fn.jplist.app.services.DTOMapperService.filters.textGroup = function(status, dataview){
						
		return jQuery.fn.jplist.domain.dom.services.FiltersService.textGroupFilter(
			status.data['textGroup']
			,status.data['logic']
			,status.data['path']
			,status.data['ignoreRegex']
			,dataview
		);
	};

	/**
	* text filter path group dto mapper
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>} dataview
	* @return {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>} dataview
	*/
	jQuery.fn.jplist.app.services.DTOMapperService.filters.textFilterPathGroup = function(status, dataview){
					
		return jQuery.fn.jplist.domain.dom.services.FiltersService.textFilterPathGroup(
			status.data['textAndPathsGroup']
			,status.data['ignoreRegex']
			,dataview
		);
	};

	/**
	* autocomplete dto mapper
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>} dataview
	* @return {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>} dataview
	*/
	jQuery.fn.jplist.app.services.DTOMapperService.filters.autocomplete = function(status, dataview){
					
		return jQuery.fn.jplist.domain.dom.services.FiltersService.autocompleteFilter(
			status.data['latitude']
			,status.data['longitude']
			,status.data['name']
			,dataview
			,status.data['radius']
		);
	};
	
	// SORTING
	
	/** 
	* DTO Mapper Service for sort
	* @type {Object}
	*/
	jQuery.fn.jplist.app.services.DTOMapperService.sort = {};
	
	/**
	* text sort dto mapper
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	* @param {jQuery.fn.jplist.domain.dom.models.DataItemModel} dataitem1
	* @param {jQuery.fn.jplist.domain.dom.models.DataItemModel} dataitem2
	* @return {number}
	*/
	jQuery.fn.jplist.app.services.DTOMapperService.sort.text = function(status, dataitem1, dataitem2){
		
		var path = new jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel(status.data.path, status.data.type);
						
		return jQuery.fn.jplist.domain.dom.services.SortService.textHelper(
			dataitem1
			,dataitem2
			,status.data.order
			,path
			,status.data.ignore || ''
		);
	};
	
	/**
	* number sort dto mapper
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	* @param {jQuery.fn.jplist.domain.dom.models.DataItemModel} dataitem1
	* @param {jQuery.fn.jplist.domain.dom.models.DataItemModel} dataitem2
	* @return {number}
	*/
	jQuery.fn.jplist.app.services.DTOMapperService.sort.number = function(status, dataitem1, dataitem2){
		
		var path = new jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel(status.data.path, status.data.type);
						
		return jQuery.fn.jplist.domain.dom.services.SortService.numbersHelper(dataitem1, dataitem2, status.data.order, path);
	};
	
	/**
	* datetime sort dto mapper
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	* @param {jQuery.fn.jplist.domain.dom.models.DataItemModel} dataitem1
	* @param {jQuery.fn.jplist.domain.dom.models.DataItemModel} dataitem2
	* @return {number}
	*/
	jQuery.fn.jplist.app.services.DTOMapperService.sort.datetime = function(status, dataitem1, dataitem2){
		
		var path = new jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel(status.data.path, status.data.type);
						
		return jQuery.fn.jplist.domain.dom.services.SortService.datetimeHelper(
			dataitem1
			,dataitem2
			,status.data.order
			,path
			,status.data.dateTimeFormat || ''
		);
	};
})();

