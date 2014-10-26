(function(){ //+
	'use strict';		
	
	/**
	* Set control status
	* @param {Object} context
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	* @param {boolean} restoredFromStorage - is status restored from storage
	*/
	var setStatus = function(context, status, restoredFromStorage){
				
		var pagingObj
			,infoType;
		
		pagingObj = status.data.paging;
			
		if(!pagingObj || pagingObj.pagesNumber <= 0){
			context.$control.html('');
			context.$control.addClass('jplist-empty');
		}
		else{
			//remove empty class
			context.$control.removeClass('jplist-empty');
			
			//get pager type
			infoType = context.$control.attr('data-type');
			
			//replace
			infoType = infoType.replace('{current}', pagingObj.currentPage + 1);
			infoType = infoType.replace('{pages}', pagingObj.pagesNumber);
			infoType = infoType.replace('{start}', pagingObj.start + 1);
			infoType = infoType.replace('{end}', pagingObj.end);
			infoType = infoType.replace('{all}', pagingObj.itemsNumber);
			
			//set html
			context.$control.html(infoType);
		}
	};

	/** 
	* Dropdown control: sort dropdown, filter dropdown, paging dropdown etc.
	* @constructor
	* @param {Object} context
	*/
	var Init = function(context){
				
		return jQuery.extend(this, context);
	};

	/**
	* Set Status
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	* @param {boolean} restoredFromStorage - is status restored from storage
	*/
	Init.prototype.setStatus = function(status, restoredFromStorage){
		setStatus(this, status, restoredFromStorage);
	};

	/** 
	* Label control (for example, contains pager info: Page 1 of 7) 
	* @constructor
	* @param {Object} context
	*/
	jQuery.fn.jplist.ui.controls.PaginationInfo = function(context){
		return new Init(context);
	};	
	
	/**
	* static control registration
	*/
	jQuery.fn.jplist.controlTypes['pagination-info'] = {
		className: 'PaginationInfo'
		,options: {}
	};	
})();

