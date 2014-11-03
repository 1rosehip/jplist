(function(){
	'use strict';
	
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
			
			//redraw callback
			if(jQuery.isFunction(context.options.redrawCallback)){
				context.options.redrawCallback(collection, $dataview, statuses);
			}
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
												
						//redraw callback
						if(jQuery.isFunction(context.options.redrawCallback)){
							context.options.redrawCallback(collection, $dataview, statuses);
						}
					}
					,context.observer
				);				
			}
			else{			
				$dataitems.detach();
				context.$itemsBox.append($dataview);
								
				//redraw callback
				if(jQuery.isFunction(context.options.redrawCallback)){
					context.options.redrawCallback(collection, $dataview, statuses);
				}
			}
		}		
	};	
	
	/**
	* init events
	* @param {Object} context
	*/
	var initEvents = function(context){
		
		/**
		* this event is sent by dataitems collection when the statuses were applied to the collection 
		* (i.e. sort, filter and pagination is done according new statuses)
		*/
		context.observer.on(context.observer.events.statusesAppliedToList, function(e, collection, statuses){
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