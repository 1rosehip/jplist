;(function(){
	'use strict';
	
	/**
	 * render html
	 * @param {Object} context
	 * @param {jQuery.fn.jplist.domain.dom.collections.Dataitems} collection
	 * @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
     * @param {jQuery.fn.jplist.app.dto.StatusDTO} lastStatus
     * @return {jQueryObject} $dataview
	 */
	var render = function(context, collection, statuses, lastStatus){
		
		var $dataitems = collection.dataitemsToJqueryObject()
			,$dataview = collection.dataviewToJqueryObject()
			,lastStatusNotInAnimation = false
			,options
			,optionsZeroDuration = jQuery.extend(true, {}, context.options, {
				duration: 0
			});
		
		//no results found
		if($dataitems.length <=0 || $dataview.length <= 0){
		
			context.$noResults.removeClass('jplist-hidden');
			context.$itemsBox.addClass('jplist-hidden');
			
			//redraw callback
			if(jQuery.isFunction(context.redrawCallback)){
				context.redrawCallback(collection, $dataview, statuses);
			}
		}
		else{
			context.$noResults.addClass('jplist-hidden');
			context.$itemsBox.removeClass('jplist-hidden');
			
			if(context.effect){

                if(lastStatus && !(lastStatus.inAnimation)){
                    lastStatusNotInAnimation = true;
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
					,context.effect //animation effect
					,context.timeline //timeline object
					,function(){
												
						//redraw callback
						if(jQuery.isFunction(context.redrawCallback)){
							context.redrawCallback(collection, $dataview, statuses);
						}
					}
					,context.observer
				);				
			}
			else{			
				$dataitems.detach();
				context.$itemsBox.append($dataview);
								
				//redraw callback
				if(jQuery.isFunction(context.redrawCallback)){
					context.redrawCallback(collection, $dataview, statuses);
				}
			}
		}

        return $dataview;
	};	
			
	/**
	 * DOM View
	 * @constructor
	 * @param {jQueryObject} $root - jplist jquery element
	 * @param {Object} options - jplist options
	 * @param {Object} observer
	 */
	jQuery.fn.jplist.ui.list.views.DOMView = function($root
                                                     ,options
                                                     ,observer
                                                     ,itemsBoxPath
                                                     ,noResultsPath
                                                     ,redrawCallback
                                                     ,effect
                                                     ,fps){
	
		this.options = options;	//user options	
		this.$root = $root; //jplist container
		this.observer = observer;
		this.redrawCallback = redrawCallback;
        this.effect = effect;
		this.timeline = null;
		this.timelineZero = null;
		this.$itemsBox = $root.find(itemsBoxPath).eq(0);
		this.$noResults = $root.find(noResultsPath);
		
		if(effect){
			
			//init timeline
			this.timeline = new jQuery.fn.jplist.animation.Timeline(fps, this.observer);
		}
	};
	
	/**
	 * render view
	 * @param {jQuery.fn.jplist.domain.dom.collections.Dataitems} collection
	 * @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
     * @param {jQuery.fn.jplist.app.dto.StatusDTO} lastStatus
     * @return {jQueryObject}
	 */
	jQuery.fn.jplist.ui.list.views.DOMView.prototype.render = function(collection, statuses, lastStatus){
		return render(this, collection, statuses, lastStatus);
	};
})();