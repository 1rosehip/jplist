(function() {
	'use strict';
	
	/**
	* Is given path is in the given paths list (compare by jquery path only, data type is ignored)
	* @param {Object} context
	* @param {jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel} path
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
	* Is 2 paths are equal
	* @param {Object} context
	* @param {jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel} path1
	* @param {jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel} path2
	* @param {boolean} pathOnly - compare only by data-path
	* @return {boolean}
	
	var isPathsEqual = function(context, path1, path2, pathOnly){
	
		var isEqual = false;
		
		if(pathOnly){
			if(path1.jqPath === path2.jqPath){				
				isEqual = true;
			}
		}
		else{
			if((path1.jqPath === path2.jqPath) && (path1.dataType === path2.dataType)){				
				isEqual = true;
			}
		}		
		
		return isEqual;
	};
	*/
	
	/**
	* add path (only unique)
	* @param {Object} context
	* @param {jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel} path
	*/
	var add = function(context, path){
		
		if(!isPathInList(context, path)){
			context.paths.push(path);
		}
	};
	
	/**
	* add range of paths (only unique)
	* @param {Object} context
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel>} paths
	*/
	var addRange = function(context, paths){
				
		for(var i=0; i<paths.length; i++){
					
			add(context, paths[i]);
		}
	};
	
	/** 
	* DataItem Member Paths Collection
	* @constructor 
	* @param {Object} options - jplist user options	
	* @param {Object} observer
	* @return {Object}
	*/
	var Init = function(options, observer){
	
		var context = {			
            options: options
			,observer: observer
			
			,paths: []
		};
		
		return jQuery.extend(this, context);
	};
	
	/**
	* add path (only unique)
	* @param {jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel} path
	*/
	Init.prototype.add = function(path){
		add(this, path);
	};
	
	/**
	* add range of paths (only unique)
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel>} paths
	*/
	Init.prototype.addRange = function(paths){
		addRange(this, paths);
	};
	
	/**
	* Is given path is in the given paths list (compare by jquery path only, data type is ignored)
	* @param {jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel} path
	* @return {boolean}
	*/
	Init.prototype.isPathInList = function(path){
		return isPathInList(this, path);
	};
	
	/** 
	* DataItem Member Paths Collection
	* @constructor 
	* @param {Object} options - jplist user options	
	* @param {Object} observer
	*/
	jQuery.fn.jplist.domain.dom.collections.DataItemMemberPathCollection = function(options, observer){
		return new Init(options, observer);
	};
	
})();