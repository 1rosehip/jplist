/**
* data item - item in list that should be sorted, filtered etc.
*/
;(function(){
	'use strict';		
			
	/**
	* find pathitem by path in the given dataitem (in the pathitems array)
	* @param {Object} context - jplist dataitem 'this' object
	* @param {jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel} path - pathitem to find
	* @return {jQuery.fn.jplist.domain.dom.models.DataItemMemberModel}	
	*/
	var findPathitem = function(context, path){
	
		var resultPathitem = null
			,pathitem
			,PATH_ONLY = true;		
		
		for(var i=0; i<context.pathitems.length; i++){
		
			//get value
			pathitem = context.pathitems[i];
			
			if(pathitem.path.isEqual(path, PATH_ONLY)){
				resultPathitem = pathitem;
				break;
			}
		}
		
		return resultPathitem;
	};
	
	/**
	* get pathitems by paths 
	* @param {Object} context - jplist dataitem 'this' object
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel>} paths - paths objects array
	* @return {Array.<jQuery.fn.jplist.domain.dom.models.DataItemMemberModel>}
	*/
	var getPathitems = function(context, paths){
	
		var path
			,pathitem
			,$element
			,pathitems = [];
		
		for(var i=0; i<paths.length; i++){
				
			//get path object
			path = paths[i];
			
			//jquery element
			$element = context.$item.find(path.jqPath);
						
			if($element.length > 0){
			
				//create pathitem
				pathitem = new jQuery.fn.jplist.domain.dom.models.DataItemMemberModel($element, path);
				
				//add to the list
				pathitems.push(pathitem);
			}
		}
		
		return pathitems;
	};

	/**
	* data item - item in list that should be sorted, filtered etc.
	* @constructor
	* @param {jQueryObject} $item - item to add to data array	
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel>} paths - paths objects array
	* @param {number} index
	* @class Dataitem - item within jplist container	
	*/
	jQuery.fn.jplist.domain.dom.models.DataItemModel = function($item, paths, index){
		
		this.pathitems = [];
		this.$item = $item;
		this.jqElement = $item;
		this.index = index;
				
		//init vars
		this.html = jQuery.fn.jplist.domain.dom.services.HelperService.getOuterHtml($item);
		
		//init pathitems
		this.pathitems = getPathitems(this, paths);
	};
		
	/**
	* Find pathitem by path (in the pathitems array)
	* @param {jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel} path - pathitem to find
	* @return {jQuery.fn.jplist.domain.dom.models.DataItemMemberModel}	
	*/
	jQuery.fn.jplist.domain.dom.models.DataItemModel.prototype.findPathitem = function(path){
		return findPathitem(this, path);
	};
	
})();

