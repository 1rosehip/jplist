/**
* jPList - jQuery Data Grid Controls ##VERSION## - http://jplist.com 
* Copyright 2014 Miriam Zusin. All rights reserved.
* For non-commercial, personal, or open source projects and applications, you may use jPList for free  http://www.binpress.com/license/read/id/2749/app/2085
* If your project generates any type of income, e.g. sells products, ads, services or just represents a commercial company, you should get a commercial license at http://www.binpress.com
*/
(function() {
	'use strict';		
	
	/**
	* add item control to the collection
	* @param {Object} context
	* @param {jQueryObject} $itemControl
	*/
	var add = function(context, $itemControl){
		
		var control = context.controlFactory.create($itemControl);
		
		if(control){
			
			//add to the list
			context.controls.push(control);
		}
	};
	
	/**
	* get panel controls
	* @param {Object} context
	*/
	var initControls = function(context){
	
		var $itemsBox;

		if(context.options && context.options.itemsBox){
			$itemsBox = context.$root.find(context.options.itemsBox);
			
			if($itemsBox.length > 0){
				
				$itemsBox.find('[data-control-type]').each(function(){
					
					//add control to the list
					add(context, jQuery(this));
				});			
			}
		}
	};
	
	/** 
	* Item Control Collection
	* @constructor 
	* @param {Object} options - jplist user options
	* @param {Object} observer
	* @param {jQuery.fn.jplist.app.History} history
	* @param {jQueryObject} $root
	* @return {Object}
	*/
	var Init = function(options, observer, history, $root){
	
		var context = {
            options: options
			,observer: observer
			,history: history
			,$root: $root
			,controls: []
			,controlFactory: null	
		};
				
		//ini control factory
		context.controlFactory = new jQuery.fn.jplist.ui.list.ItemControlFactory(options, observer, history, $root);
		
		//init controls
		initControls(context);
		
		return jQuery.extend(this, context);
	};
		
	/** 
	* Item Control Collection
	* @constructor 
	* @param {Object} options - jplist user options	
	* @param {Object} observer
	* @param {jQuery.fn.jplist.app.History} history
	* @param {jQueryObject} $root
	* @return {Object}
	*/
	jQuery.fn.jplist.ui.list.collections.ItemControlCollection = function(options, observer, history, $root){	
		return new Init(options, observer, history, $root);
	};
	
})();