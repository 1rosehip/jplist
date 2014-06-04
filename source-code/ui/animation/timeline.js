/**
* jQuery jPList Plugin ##VERSION## 
* Copyright 2014 Miriam Zusin. All rights reserved.
* To use this file you must buy a licence at http://codecanyon.net/user/no81no/portfolio 
*/
(function(){
	'use strict';	
	
	/**
	* stop
	* @param {Object} context - 'this' object
	*/
	var stop = function(context){
		
		if(context.handler){
			window.clearTimeout(context.handler);
		}
		
		//update vars
		context.progress = 0;
		context.start = null;
		
		//complete
		context.observer.trigger(context.observer.events.animationCompleteEvent, []);
	};
	
	/**
	* play
	* @param {Object} context - 'this' object
	* @param {number} duration - the full time the animation should take, in milliseconds
	*/
	var play = function(context, duration){
		
		if(jQuery.isNumeric(duration) && duration > 0){
			
			context.handler = window.setTimeout(function(){ 
				
				var timePassed; //The time (in ms) passed from the animation start. Changes from 0 to duration, but may occasionally exceed duration because the browser timer is imprecise.
				
				if(context.start === null){
					
					//start
					context.observer.trigger(context.observer.events.animationStartEvent, []);
					
					//init start value
					context.start = new Date().getTime();
				}
				
				//get current time
				timePassed = (new Date().getTime()) - context.start;
				
				//update progress
				context.progress = timePassed / duration;	
				
				if(context.progress >= 1){
					context.progress = 1;
				}
				
				//trigger step event
				context.observer.trigger(context.observer.events.animationStepEvent, [context.progress*100, context]);
				
				if(context.progress < 1){
					
					//play next frame
					play(context, duration);
				}
				else{
					stop(context);
				}
				
				
			}, context.delay);
		}
		else{
			stop(context);			
		}
	};
		
	/**
	* timeline constructor
	* @constructor
	* @param {jQueryObject} $scene
	* @param {Object} options - user options
	* @param {Object} observer
	* @return {Object}
	*/
	var Init = function($scene, options, observer){
		
		var context = {
			$scene: $scene
			,options: options
			,observer: observer
			
			,start: null //the time of animation start, start = new Date
			,progress: 0 // The fraction of animation time that has already passed, calculated on every frame as timePassed/duration. Gradually moves from 0 to 1. For example, value progress = 0.5 means that half of duration time is out.
			,delay: null //time between frames (in ms, 1/1000 of second)
			
			,handler: null
		};		
		
		//init avrs
		context.delay = 1000/context.options.fps;
		
		return jQuery.extend(this, context);
	};
	
	//API:
	
	/**
	* Play timeline
	* @param {number} duration - the full time the animation should take, in milliseconds
	* @public	
	* @memberOf jQuery.fn.jplist.animation.Timeline#
	* @name play
	* @function
	*/
	Init.prototype.play = function(duration){
		play(this, duration);
	};	
	
	/**
	* Stop timeline
	* @public	
	* @memberOf jQuery.fn.jplist.animation.Timeline#
	* @name stop
	* @function
	*/
	Init.prototype.stop = function(){
		stop(this);
	};	
		
	/**
	* Timeline
	* @constructor
	* @param {jQueryObject} $scene
	* @param {Object} options - user options
	* @param {Object} observer
	*/
	jQuery.fn.jplist.animation.Timeline = function($scene, options, observer){		
		return new Init($scene, options, observer);
	};
	
})();