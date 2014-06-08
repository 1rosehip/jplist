/**
* jQuery jPList Plugin ##VERSION## 
* Copyright 2014 Miriam Zusin. All rights reserved.
* http://jplist.com 
*/
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
	* @param {string} html
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
	*/
	var renderCallback = function(context, html, statuses){
		
		//animate to top
		//animateToTop(context);
		
		//send redraw event
		context.observer.trigger(context.observer.events.setStatusesEvent, [statuses, html]);
		
		if(context.options.deepLinking){
				
			//if deep linking is enabled -> change url by statuses
			context.observer.trigger(context.observer.events.changeUrlDeepLinksEvent, []);
		}
			
		//redraw callback
		if(jQuery.isFunction(context.options.redrawCallback)){
			context.options.redrawCallback(html, statuses);
		}
	};
	
	/**
	* build result html
	* @param {Object} context
	* @param {string} html
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
	*/
	var buildHtml = function(context, html, statuses){
		
		var lastStatusNotInAnimation = false
			,lastStatus
			,options
			,optionsZeroDuration = jQuery.extend(true, {}, context.options, {
				duration: 0
			});
			
		//no results found
		if(!html || jQuery.trim(html) === ''){
			context.$noResults.removeClass('jplist-hidden');
			context.$itemsBox.addClass('jplist-hidden');
		}
		else{
			context.$noResults.addClass('jplist-hidden');
			context.$itemsBox.removeClass('jplist-hidden');
		}
		
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
				,null
				,jQuery(html) //new items
				,context.options.effect //animation effect
				,context.timeline //timeline object
				,function(){
					
					//send render callback
					renderCallback(context, html, statuses);
				}
				,context.observer
			);		
		}
		else{
			//update container html
			context.$itemsBox.html(html);
			
			//send render callback
			renderCallback(context, html, statuses);
		}
	};
	
	/**
	* init events
	* @param {Object} context - jplist controller 'this' object
	*/
	var initEvents = function(context){
		
		/**
		* on render statuses events
		* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
		*/
		context.observer.on(context.observer.events.renderStatusesEvent, function(event, statuses){
			
			//hide items box
			//context.$itemsBox.addClass('jplist-hidden');
			
			//hide no results section
			context.$noResults.addClass('jplist-hidden');
						
			//send event to controller that view is ready
			context.observer.trigger(context.observer.events.renderList, [context, statuses]);			
		});
		
		/**
		* on model changed
		* @param {jQuery.fn.jplist.domain.serverHTML.models.DataItemModel|null} dataItem
		* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>|null} statuses
		*/
		context.scopeObserver.on(context.scopeObserver.events.modelChanged, function(e, dataItem, statuses){
			
			//hide preloader -> rebuild html
			if(context.$preloader){
				context.$preloader.addClass('jplist-hidden');
			}
			
			//show items box
			context.$itemsBox.removeClass('jplist-hidden');
			
			//build result html
			buildHtml(context, /** @type {string} */ (dataItem.html), statuses);
		});
	};
	
	/**
	* Server HTML List View
	* @constructor 
	* @param {jQueryObject} $root - jplist jquery element
	* @param {Object} options - jplist options
	* @param {Object} observer - common observer
	* @param {Object} scopeObserver - list observer
	* @param {jQuery.fn.jplist.ui.list.models.DataItemModel} model
	* @param {jQuery.fn.jplist.app.History} history	
	* @return {Object}	
	*/
	var Init = function($root, options, observer, scopeObserver, model, history){
	
		var context = {
			options: options	//user options	
			,$root: $root //jplist container
			,observer: observer
			,scopeObserver: scopeObserver
			,model: model
			,history: history
			
			,$itemsBox: $root.find(options.itemsBox).eq(0)
			,$noResults: $root.find(options.noResults)
			,$preloader: null
			,timeline: null
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
	* Server HTML List View
	* @constructor 
	* @param {jQueryObject} $root - jplist jquery element
	* @param {Object} options - jplist options
	* @param {Object} observer
	* @param {Object} scopeObserver	
	* @param {jQuery.fn.jplist.ui.list.models.DataItemModel} model
	* @param {jQuery.fn.jplist.app.History} history	
	*/
	jQuery.fn.jplist.ui.list.views.ServerHTMLView = function($root, options, observer, scopeObserver, model, history){	
		return new Init($root, options, observer, scopeObserver, model, history);
	};
})();