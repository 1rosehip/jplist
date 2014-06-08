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
	*/
	var animateToTop = function(context){
		
		var offset;
				
		//set offset
		offset = jQuery(context.options.animateToTop).offset().top;
		
		jQuery('html, body').animate({
			scrollTop: offset
		}, context.options.animateToTopDuration);
	};
	
	/**
	* replace hash in url
	* @param {string} hash
	*/
	var replaceHash = function(hash){
	
		var hashStr = jQuery.trim(hash.replace('#', ''))
			,href
			,index;
		
		if(hashStr === ''){
			hashStr = '#';
		}
		else{
			hashStr = '#' + hashStr;
		}
		
		if(window.location.hash !== hashStr){
		
			index = window.location.href.indexOf('#');
			
			if(index == -1){
				href = window.location.href + hashStr;
			}
			else{
				href = window.location.href.substring(0, index) + hashStr;
			}
			
			if('replaceState' in window.history){
				window.history.replaceState('', '', href);
			}
			else{
				window.location.replace(href);		
			}
		}
	};		
	
	/**
	* get params from deep link url
	* @param {Object} context - jplist panel 'this' object
	* @param {string} hash
	* @return {Array.<Object>} array of params {controlName: '...', propName: '...', propValue: '...'}
	*/
	var getParamsFromDeepLinkUrl = function(context, hash){
		
		var sections = []
			,section
			,params = []
			,param
			,pairSections
			,keySections
			,key
			,value;
		
		if(context.options.deepLinking && jQuery.trim(hash) !== ''){
			
			//get sections
			sections = hash.split(context.options.delimiter1);
			
			for(var i=0; i<sections.length; i++){
				
				//get section
				section = sections[i];
				
				//get pair: key + value
				pairSections = section.split('=');
				
				if(pairSections.length === 2){
					
					//get pair
					key = pairSections[0];
					value = pairSections[1];
					
					//get key sections
					keySections = key.split(context.options.delimiter0);
					
					if(keySections.length === 2){
						
						param = {
							controlName: keySections[0]
							,propName: keySections[1]
							,propValue: value
						};
						
						params.push(param);
					}
				}
			}
		}
	
		return params;
	};
		
	/**
	* set sticky position
	* @param {jQueryObject} $stickyEl - sticky element on the panel
	*/
	var setStickyPosition = function($stickyEl){
		
		var scrollTop = jQuery(window).scrollTop()
			,top;
		
		//get top value
		top = Number($stickyEl.data('top'));
		
		if(!isNaN(top)){
		
			if (scrollTop > top){ 
				$stickyEl.addClass('jplist-sticky');
			}
			else{
				$stickyEl.removeClass('jplist-sticky');
			}
		}
	};
	
	/**
	* init sticky elements
	* @param {jQueryObject} $sticky - sticky elements on the panel
	*/
	var initSticky = function(context, $sticky){
			
		$sticky.each(function(){
			
			var $stickyEl = jQuery(this)
				,top = $stickyEl.offset().top;
			
			//save top value
			$stickyEl.data('top', top);
			
			//set position first time
			setStickyPosition($stickyEl);
		});
		
		jQuery(window).scroll(function(){
			
			$sticky.each(function(){
							
				//set position first time
				setStickyPosition( jQuery(this));
			});
		});
	};
	
	/**
	* init events
	* @param {Object} context - jplist panel 'this' object
	*/
	var initEvents = function(context){
		
		var NOT_RESTORED_FROM_COOKIES = false
			,RESTORED_FROM_COOKIES = true;
				
		/**
		* event from controller to panel after html rebuild
		*/
		context.observer.on(context.observer.events.setStatusesEvent, function(event, statusesArray, collection){
						
			//set statuses
			context.controls.setStatuses(statusesArray, NOT_RESTORED_FROM_COOKIES);		

			//save statuses in history
			context.history.addList(statusesArray);
			
			//debug info
			jQuery.fn.jplist.info(context.options, 'Set statuses event: ', statusesArray);
		});
		
		/**
		* event to panel -> panel sends build statuses event
		*/
		context.observer.on(context.observer.events.forceRenderStatusesEvent, function(event, isDefault){
		
			var statuses;			
			
			//get current statuses
			statuses = context.controls.getStatuses(isDefault);
			
			//debug info
			jQuery.fn.jplist.info(context.options, 'Force render statuses event: ', statuses);
			
			//trigger build statuses event
			context.observer.trigger(context.observer.events.renderStatusesEvent, [statuses]);
		});		
		
		/**
		* event to panel -> restore panel from event data (statuses array)
		*/
		context.observer.on(context.observer.events.restoreEvent, function(event, statusesArray){
			
			//apply set statuses on controls
			context.controls.setStatuses(statusesArray, RESTORED_FROM_COOKIES);
			
			//debug info
			jQuery.fn.jplist.info(context.options, 'Restore from storage event: ', statusesArray);
			
			//render statuses event
			context.observer.trigger(context.observer.events.renderStatusesEvent, [statusesArray]);			
		});	
		
		/**
		* event to panel -> get all statuses and merge them with the given status, then send build statuses event
		*/
		context.observer.on(context.observer.events.statusEvent, function(event, status){			
			
			var IS_DEFAULT = false
				,statuses;
			
			if(status.isAnimateToTop){
				animateToTop(context);
			}
			
			statuses = context.controls.merge(IS_DEFAULT, status);
			
			//debug info
			jQuery.fn.jplist.info(context.options, 'Status event: ', statuses);
					
			//render html by statuses
			context.observer.trigger(context.observer.events.renderStatusesEvent, [statuses]);			
		});
		
		/**
		* event to panel -> get deep links from all panel controls
		*/
		context.observer.on(context.observer.events.changeUrlDeepLinksEvent, function(event){	
		
			var deepLinkUrl = '';
			
			if(context.options.deepLinking){
							
				//get deep link url
				deepLinkUrl = context.controls.getDeepLinksUrl();
				
				//debug info
				jQuery.fn.jplist.info(context.options, 'Change url (deep links event): ', deepLinkUrl);
				
				//set new hash
				//window.location.hash = deepLinkUrl;
				replaceHash(deepLinkUrl);
			}
		});
		
		/**
		* event to panel -> set panel controls statuses by their deep links
		*/
		context.observer.on(context.observer.events.setDeepLinksEvent, function(event){	
			
			var hash = window.decodeURIComponent(jQuery.trim(window.location.hash.replace('#', '')))
				,params
				,isStorageEnabled = false
				,storageStatuses = [];
			
			//set deep links
			params = getParamsFromDeepLinkUrl(context, hash);
			
			//debug info
			jQuery.fn.jplist.info(context.options, 'Set deep link event: ', params);
			
			if(params.length <= 0){
				
				isStorageEnabled = (context.options.storage === 'cookies') || ((context.options.storage === 'localstorage') && jQuery.fn.jplist.dal.services.LocalStorageService.supported());
				
				//check storage
				if(isStorageEnabled){
				
					if(context.options.storage === 'cookies'){
						
						//restore statuses from storage
						storageStatuses = jQuery.fn.jplist.dal.services.CookiesService.restoreCookies(context.options.storageName);
					}
					
					if((context.options.storage === 'localstorage') && jQuery.fn.jplist.dal.services.LocalStorageService.supported()){
						
						//restore statuses from storage
						storageStatuses = jQuery.fn.jplist.dal.services.LocalStorageService.restore(context.options.storageName);
					}
					
					//send redraw event
					if(storageStatuses.length > 0){
					
						context.observer.trigger(context.observer.events.restoreEvent, [storageStatuses]);
					}
					else{
						//send panel redraw event
						context.observer.trigger(context.observer.events.forceRenderStatusesEvent, [false]);
					}
				}
				else{
				
					//send panel redraw event
					context.observer.trigger(context.observer.events.forceRenderStatusesEvent, [true]);
				}				
			}
			else{				
				context.controls.setDeepLinks(params);				
			}			
		});
		
		/**
		* on ios button click -> toggle next panel
		*/
		context.$root.find(context.options.iosBtnPath).on('click', function(){			
			jQuery(this).next(context.options.panelPath).toggleClass('jplist-ios-show');
		});
	};
	
	/**
	* init controls and paths
	* @param {Object} context
	*/
	var initControlsAndPaths = function(context){
		
		var $panel
			,$controls
			,paths = [];
		
		//init panel controls
		$panel = context.$root.find(context.options.panelPath);
		$controls = $panel.find('[data-control-type]');	
		
		context.controls = new jQuery.fn.jplist.ui.panel.collections.ControlsCollection(context.options, context.observer, context.history, context.$root, $controls);
		
		//get panel paths
		context.paths = context.controls['getPaths']();
		
		//debug info
		if(jQuery.fn.jplist.logEnabled(context.options)){
			
			paths = jQuery.map(context.paths, function(el, index){
				if(el && el.jqPath){
					return el.jqPath;
				}
				
				return '';
			});
			
			jQuery.fn.jplist.info(context.options, 'Panel paths: ', paths.join(', '));
		}
	};
	
	/**
	* panel constructor
	* @param {jQueryObject} $root - jplist jquery element
	* @param {Object} options - jplist options
	* @param {jQuery.fn.jplist.app.History} history
	* @param {Object} observer
	* @return {Object} - panel + this
	* @constructor 
	*/
	var Init = function($root, options, history, observer){
	
		var context = {
			options: options	//user options	
			,$root: $root //jplist container
			,history: history
			,observer: observer
				
			,$sticky: null
			,paths: null //all paths	
			,controls: null
		};	
		
		//init controls and paths
		initControlsAndPaths(context);
		
		//find sticky elements
		context.$sticky = context.$root.find('[data-sticky="true"]');
		
		//init sticky
		if(context.$sticky.length > 0){
			initSticky(context, context.$sticky);
		}
		
		//init events
		initEvents(context);
		
		return jQuery.extend(this, context);
	};
	
	/**
	* Panel constructor
	* @param {jQueryObject} $root - jplist jquery element
	* @param {Object} options - jplist options
	* @param {jQuery.fn.jplist.app.History} history
	* @param {Object} observer
	* @constructor 
	*/
	jQuery.fn.jplist.ui.panel.controllers.PanelController = function($root, options, history, observer){
	
		var context = new Init($root, options, history, observer);
		
		//properties
		this.paths = context['paths'];
		this.history = context['history'];
		this.controls = context['controls'];
	};
})();