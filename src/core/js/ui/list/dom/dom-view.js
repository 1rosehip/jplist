;(function(){
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
	* List View
	* @constructor 
	* @param {jQueryObject} $root - jplist jquery element
	* @param {Object} options - jplist options
	* @param {Object} observer
	* @param {jQuery.fn.jplist.app.History} history	
	*/
	jQuery.fn.jplist.ui.list.views.DOMView = function($root, options, observer, history){	
	
		this.options = options;	//user options	
		this.$root = $root; //jplist container
		this.observer = observer;
		this.history = history;
		
		this.timeline = null;
		this.timelineZero = null;
		this.$itemsBox = $root.find(options.itemsBox).eq(0);
		this.$noResults = $root.find(options.noResults);
		
		if(this.options.effect){
			
			//init timeline
			this.timeline = new jQuery.fn.jplist.animation.Timeline(this.$root, this.options, this.observer);
		}
	};
	
	/**
	* render view
	* @param {jQuery.fn.jplist.domain.dom.collections.DataItemsCollection} collection
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
	*/
	jQuery.fn.jplist.ui.list.views.DOMView.prototype.render = function(collection, statuses){
		render(this, collection, statuses);
	};
})();