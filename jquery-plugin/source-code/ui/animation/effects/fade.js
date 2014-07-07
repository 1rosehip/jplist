/**
* jPList - jQuery Data Grid Controls ##VERSION## - http://jplist.com 
* Copyright 2014 Miriam Zusin. All rights reserved.
* For non-commercial, personal, or open source projects and applications, you may use jPList for free under the terms of the GPL V3 License (https://gnu.org/licenses/gpl.html)
* If your project generates any type of income, e.g. sells products, ads, services or just represents a commercial company, you should get a commercial license at http://www.binpress.com
*/
(function(){
	'use strict';
	
	/**
	* Slide Left Effect
	* @type {Object}
	* @class Slide Left Effect
	*/
	jQuery.fn.jplist.animation.fade = {};
	
	/**
	* 'before effect'
	* @param {Object} options - user options
	* @param {jQueryObject} $itemsBox - items container element
	* @param {jQueryObject} $dataitems - all items
	* @param {jQueryObject} $dataview - new items
	*/
	jQuery.fn.jplist.animation.fade.before = function(options, $itemsBox, $dataitems , $dataview){};
	
	/**
	* effect
	* @param {Object} options - user options
	* @param {jQueryObject} $itemsBox - items container element
	* @param {jQueryObject} $dataitems - all items
	* @param {jQueryObject} $dataview - new items
	* @param {number} progress - animation progress in %
	*/
	jQuery.fn.jplist.animation.fade.effect = function(options, $itemsBox, $dataitems , $dataview, progress){
		
		//items: left 0 to -100%		
		$itemsBox.find(options.itemPath).css({
			opacity: (100 - progress)/100
		});
	};
	
	/**
	* 'after effect' function
	* @param {Object} options - user options
	* @param {jQueryObject} $itemsBox - items container element
	* @param {jQueryObject} $dataitems - all items
	* @param {jQueryObject} $dataview - new items
	*/
	jQuery.fn.jplist.animation.fade.after = function(options, $itemsBox, $dataitems , $dataview){
		
		$itemsBox.empty();
			
		$dataview.css({
			opacity: 1
		});
		
		$itemsBox.append($dataview);
	};
	
	
})();	