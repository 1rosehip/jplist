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