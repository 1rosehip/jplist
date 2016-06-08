/**
* data item - item in list that should be sorted, filtered etc.
*/
;(function(){
	'use strict';		
			
	/**
	 * find pathitem by path in the given dataitem (in the pathitems array)
	 * @param {Object} context
	 * @param {jQuery.fn.jplist.PathModel} path - pathitem to find
	 * @return {jQuery.fn.jplist.DataItemMemberModel}
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
	 * @param {Object} context
	 * @param {Array.<jQuery.fn.jplist.PathModel>} paths - paths objects array
	 * @return {Array.<jQuery.fn.jplist.DataItemMemberModel>}
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
			$element = context.$item.find(path.jqPath).addBack(path.jqPath);

			if($element.length > 0){
			
				//create pathitem
				pathitem = new jQuery.fn.jplist.DataItemMemberModel($element, path);
				
				//add to the list
				pathitems.push(pathitem);
			}
		}

        //add empty path; in this case it should be the whole element
        path = new jQuery.fn.jplist.PathModel('', null);
        pathitem = new jQuery.fn.jplist.DataItemMemberModel(context.$item, path);
        pathitems.push(pathitem);
		
		return pathitems;
	};

    /**
     * add new paths to the dataitem
     * @param {Object} context
     * @param {Array.<jQuery.fn.jplist.PathModel>} paths
     */
    var addPaths = function(context, paths){

        context.pathitems = context.pathitems.concat(getPathitems(context, paths));
    };

	/**
	 * data item - item in list that should be sorted, filtered etc.
	 * @constructor
	 * @param {jQueryObject} $item - item to add to data array
	 * @param {Array.<jQuery.fn.jplist.PathModel>} paths - paths objects array
	 * @param {number} index
	 * @class Dataitem - item within jplist container
	 */
	jQuery.fn.jplist.DataItemModel = function($item, paths, index){

		this.pathitems = [];
		this.$item = $item;
		this.jqElement = $item;
		this.index = index;
				
		//init vars
		this.html = jQuery.fn.jplist.HelperService.getOuterHtml($item);
		
		//init pathitems
		this.pathitems = getPathitems(this, paths);
	};
		
	/**
	 * Find pathitem by path (in the pathitems array)
	 * @param {jQuery.fn.jplist.PathModel} path - pathitem to find
	 * @return {jQuery.fn.jplist.DataItemMemberModel}
	 */
	jQuery.fn.jplist.DataItemModel.prototype.findPathitem = function(path){
		return findPathitem(this, path);
	};

    /**
     * add new paths to the dataitem
     * @param {Array.<jQuery.fn.jplist.PathModel>} paths
     */
    jQuery.fn.jplist.DataItemModel.prototype.addPaths = function(paths){
        addPaths(this, paths);
    };
	
})();

