/**
* DataItem Member Paths Collection
*/
;(function() {
	'use strict';
	
	/**
	* Is given path is in the given paths list (compare by jquery path only, data type is ignored)
	* @param {Object} context
	* @param {jQuery.fn.jplist.PathModel} path
	* @return {boolean}
	*/
	var isPathInList = function(context, path){
	
		var cpath
			,isInList = false
			,PATH_ONLY = true;
		
		for(var i=0; i<context.paths.length; i++){
		
			//get path
			cpath = context.paths[i];
			
			if(cpath.isEqual(path, PATH_ONLY)){
				isInList = true;
				break;
			}
		}
		
		return isInList;
	};
		
	/**
	* add path (only unique)
	* @param {Object} context
	* @param {jQuery.fn.jplist.PathModel} path
	*/
	var add = function(context, path){
		
		if(!isPathInList(context, path)){
			context.paths.push(path);
		}
	};
	
	/**
	* add range of paths (only unique)
	* @param {Object} context
	* @param {Array.<jQuery.fn.jplist.PathModel>} paths
	*/
	var addRange = function(context, paths){
				
		for(var i=0; i<paths.length; i++){
					
			add(context, paths[i]);
		}
	};
	
	/** 
	* DataItem Member Paths Collection
	* @constructor
	*/
	jQuery.fn.jplist.PathCollection = function(){
		this.paths = [];
	};
	
	/**
	* add path (only unique)
	* @param {jQuery.fn.jplist.PathModel} path
	*/
	jQuery.fn.jplist.PathCollection.prototype.add = function(path){
		add(this, path);
	};
	
	/**
	* add range of paths (only unique)
	* @param {Array.<jQuery.fn.jplist.PathModel>} paths
	*/
	jQuery.fn.jplist.PathCollection.prototype.addRange = function(paths){
		addRange(this, paths);
	};
	
	/**
	* Is given path is in the given paths list (compare by jquery path only, data type is ignored)
	* @param {jQuery.fn.jplist.PathModel} path
	* @return {boolean}
	*/
	jQuery.fn.jplist.PathCollection.prototype.isPathInList = function(path){
		return isPathInList(this, path);
	};
	
})();