(function(){
	'use strict';
	
	/**
	* animate to top
	* @param {Object} context - jplist panel 'this' object
	
	var animateToTop = function(context){
		
		var offset;
		
		if(context.options.animateToTop !== ''){
		
			//set offset
			if(context.options.animateToTop !== 'auto'){
				offset = jQuery(context.options.animateToTop).offset().top;
			}
			else{
				offset = context.$root.offset().top;
			}
			
			jQuery('html, body').animate({
				scrollTop: offset
			}, context.options.animateToTopDuration);
		}
	};
	*/
	
	/**
	* render callback
	* @param {Object} context - jplist panel 'this' object
	* @param {jQuery.fn.jplist.domain.dom.collections.DataItemsCollection} collection
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
	* @param {jQueryObject} $dataview
	*/
	var renderCallback = function(context, collection, statuses, $dataview){
		
		//animate to top
		//animateToTop(context);
		
		//send redraw event
		context.observer.trigger(context.observer.events.setStatusesEvent, [statuses, collection]);
		
		//redraw callback
		if(jQuery.isFunction(context.options.redrawCallback)){
			context.options.redrawCallback(collection, $dataview, statuses);
		}
	};
	
	/**
	* render html
	* @param {Object} context
	* @param {jQuery.fn.jplist.domain.dom.collections.DataItemsCollection} collection
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
	*/
	var render = function(context, collection, statuses){
		
		var $dataitems = collection.dataitemsToJqueryObject()
			,$dataview = collection.dataviewToJqueryObject()
			,lastStatusNotInAnimation = false
			,lastStatus
			,options
			,optionsZeroDuration = jQuery.extend(true, {}, context.options, {
				duration: 0
			});
		
		//no results found
		if($dataitems.length <=0 || $dataview.length <= 0){
		
			context.$noResults.removeClass('jplist-hidden');
			context.$itemsBox.addClass('jplist-hidden');
			
			//send render callback
			renderCallback(context, collection, statuses, $dataview);
		}
		else{
			context.$noResults.addClass('jplist-hidden');
			context.$itemsBox.removeClass('jplist-hidden');
			
			if(context.options.effect){
				
				//get last status from history
				if(context.history){
					lastStatus = context.history.getLastStatus();
					
					if(lastStatus && !(lastStatus.inAnimation)){
						lastStatusNotInAnimation = true;
					}
				}
			
				if(lastStatusNotInAnimation){
					options = optionsZeroDuration;
				}
				else{
					options = context.options;					
				}
				
				//animate items
				jQuery.fn.jplist.animation.drawItems(
					options //user options
					,context.$itemsBox //scene
					,$dataitems
					,$dataview //new items
					,context.options.effect //animation effect
					,context.timeline //timeline object
					,function(){
						
						//send render callback
						renderCallback(context, collection, statuses, $dataview);
					}
					,context.observer
				);				
			}
			else{			
				$dataitems.detach();
				context.$itemsBox.append($dataview);
				
				//send render callback
				renderCallback(context, collection, statuses, $dataview);
			}
		}		
	};	
	
	/**
	* init events
	* @param {Object} context
	*/
	var initEvents = function(context){
		
		/**
		* on 'render list' event
		*/
		context.observer.on(context.observer.events.renderList, function(e, collection, statuses){
			render(context, collection, statuses);
		});
	};
	
	/**
	* List View
	* @constructor 
	* @param {jQueryObject} $root - jplist jquery element
	* @param {Object} options - jplist options
	* @param {Object} observer
	* @return {Object}
	* @param {jQuery.fn.jplist.app.History} history	
	*/
	var Init = function($root, options, observer, history){
	
		var context = {
			options: options	//user options	
			,$root: $root //jplist container
			,observer: observer
			,history: history
			
			,timeline: null
			,timelineZero: null
			,$itemsBox: $root.find(options.itemsBox).eq(0)
			,$noResults: $root.find(options.noResults)
		};
		
		if(context.options.effect){
			
			//init timeline
			context.timeline = new jQuery.fn.jplist.animation.Timeline(context.$root, context.options, context.observer);
		}

		//init events
		initEvents(context);
		
		return jQuery.extend(this, context);
	};
	
	/**
	* List View
	* @constructor 
	* @param {jQueryObject} $root - jplist jquery element
	* @param {Object} options - jplist options
	* @param {Object} observer
	* @param {jQuery.fn.jplist.app.History} history	
	*/
	jQuery.fn.jplist.ui.list.views.DOMView = function($root, options, observer, history){	
		return new Init($root, options, observer, history);
	};
})();