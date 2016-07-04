(function(){
	'use strict';

    /**
     * jPList definition
     * @type {Object}
     */
    jQuery.fn.jplist = jQuery.fn.jplist || {};

	/**
	* Animation Service
	* @type {Object}
	* @class Animation Service
	*/
	jQuery.fn.jplist.animation = {};

	/**
	* Draw items	
	* @param {Object} options - user options
	* @param {jQueryObject} $itemsBox - items container element
	* @param {jQueryObject} $dataitems - all items
	* @param {jQueryObject} $dataview - new items
	* @param {string} effect - animation effect
	* @param {Function} endCallback
	* @param {Object} observer
	*/
	jQuery.fn.jplist.animation.drawItems = function(options, $itemsBox, $dataitems, $dataview, effect, endCallback, observer){
		
		var effectClass
			,beforeMethod
			,afterMethod
			,effectMethod
            ,timeline;
		
		//get effect class
		effectClass = jQuery.fn.jplist.animation[effect];	
		
		if(effectClass){
					
			//init methods
			beforeMethod = effectClass['before'];
			effectMethod = effectClass['effect'];
			afterMethod = effectClass['after'];
					
			//call 'before' method
			if(jQuery.isFunction(beforeMethod)){
				
				beforeMethod(options, $itemsBox, $dataitems, $dataview);
			}
			
			if(jQuery.isFunction(effectMethod)){
				
				observer.on('animationStepEvent', function(e, progress, data){

					//call 'effect' method
					effectMethod(options, $itemsBox, $dataitems, $dataview, progress);
				});				
			}
				
			observer.on('animationCompleteEvent', function(e){
				
				//after method
				if(jQuery.isFunction(afterMethod)){
				
					//call after method
					afterMethod(options, $itemsBox, $dataitems, $dataview);
				}
				
				observer.off('animationStepEvent');
				observer.off('animationCompleteEvent');
				
				if(jQuery.isFunction(endCallback)){
					endCallback();
				}
			});

            //init timeline
            timeline = new jQuery.fn.jplist.animation.Timeline(options.fps, observer);
						
			//start effect
			timeline.play(options.duration);
		}
		else{
			if(jQuery.isFunction(endCallback)){
				endCallback();
			}
		}
	};
	
})();	