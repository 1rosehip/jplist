(function(){
	'use strict';

	/**
	 * build result content
	 * @param {Object} context
	 * @param {jQuery.fn.jplist.DomainDataItemServerModel} dataItem
	 * @param {Array.<jQuery.fn.jplist.StatusDTO>} statuses
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
				
		//on model changed
		//@param {jQuery.fn.jplist.DomainDataItemServerModel|null} dataItem
		//@param {Array.<jQuery.fn.jplist.StatusDTO>|null} statuses
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
	 * @param {Object} observer
	 * @param {Object} scopeObserver
	 * @param {jQuery.fn.jplist.DataItemServerModel} model
	 * @param {jQuery.fn.jplist.History} history
	 */
	jQuery.fn.jplist.ServerView = function($root, options, observer, scopeObserver, model, history){
	
		this.options = options;
		this.observer = observer;
		this.scopeObserver = scopeObserver;
		this.model = model;
		this.history = history;
		
		this.$itemsBox = $root.find(options.itemsBox).eq(0);
		this.$noResults = $root.find(options.noResults);
		
		if(this.options.effect){
			
			//init timeline
			this.timeline = new jQuery.fn.jplist.animation.Timeline(this.options.fps, this.observer);
		}
		
		//init events
		initEvents(this);
	};
})();