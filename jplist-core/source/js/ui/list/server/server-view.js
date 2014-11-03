(function(){
	'use strict';

	/**
	* build result content
	* @param {Object} context
	* @param {jQuery.fn.jplist.domain.server.models.DataItemModel} dataItem
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
	*/
	var buildContent = function(context, dataItem, statuses){
		
		var lastStatusNotInAnimation = false
			,lastStatus
			,options
			,optionsZeroDuration = jQuery.extend(true, {}, context.options, {
				duration: 0
			});
			
		//no results found
		if(!(dataItem.content) || jQuery.trim(dataItem.content) === ''){
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
				,jQuery(dataItem.content) //new items
				,context.options.effect //animation effect
				,context.timeline //timeline object
				,function(){
										
					//redraw callback
					if(jQuery.isFunction(context.options.redrawCallback)){
						context.options.redrawCallback(dataItem.content, statuses);
					}
				}
				,context.observer
			);		
		}
		else{
			if(context.options.dataSource && jQuery.isFunction(context.options.dataSource.render)){
			
				//render the content
				context.options.dataSource.render(dataItem, statuses);				
			}
			else{
				//update container content
				context.$itemsBox.html(dataItem.content);
			}
			
			if(jQuery.isFunction(context.options.redrawCallback)){
				context.options.redrawCallback(dataItem.content, statuses);
			}
		}
	};
	
	/**
	* init events
	* @param {Object} context - jplist controller 'this' object
	*/
	var initEvents = function(context){
		
		/**
		* on known statuses change
		* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
		*/
		context.observer.on(context.observer.events.knownStatusesChanged, function(event, statuses){
						
			//hide no results section
			context.$noResults.addClass('jplist-hidden');
		});
		
		/**
		* on model changed
		* @param {jQuery.fn.jplist.domain.server.models.DataItemModel|null} dataItem
		* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>|null} statuses
		*/
		context.scopeObserver.on(context.scopeObserver.events.modelChanged, function(e, dataItem, statuses){
			
			//hide preloader -> rebuild html
			if(context.$preloader){
				context.$preloader.addClass('jplist-hidden');
			}
			
			//show items box
			context.$itemsBox.removeClass('jplist-hidden');
			
			//build result content
			buildContent(context, dataItem, statuses);
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
	jQuery.fn.jplist.ui.list.views.ServerView = function($root, options, observer, scopeObserver, model, history){	
		return new Init($root, options, observer, scopeObserver, model, history);
	};
})();