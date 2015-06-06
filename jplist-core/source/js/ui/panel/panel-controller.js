(function(){
	'use strict';
	
	// ----------------------- HELPERS ----------------------------------
	
	/**
	* animate to top
	* @param {Object} context
	*/
	var animateToTop = function(context){
		
		var offset;
				
		//set offset
		offset = jQuery(context.options.animateToTop).offset().top;
		
		jQuery('html, body').animate({
			scrollTop: offset
		}, context.options.animateToTopDuration);
	};
	
	// ----------------------- STICKY -----------------------------------
	
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
	
	// ----------------------- DEEP LINKS -------------------------------
	
	/**
	* set panel controls statuses by their deep links
	* @param {Object} context
	*/
	var setStatusesByDeepLink = function(context){
		
		var params
			,isStorageEnabled = false
			,storageStatuses = [];
		
		//set deep links
		params = jQuery.fn.jplist.domain.deeplinks.services.DeepLinksService.getUrlParams(context.options);
		
		//debug info
		jQuery.fn.jplist.info(context.options, 'Set statuses by deep link: ', params);
		
		if(params.length <= 0){
			
			//try set panel controls statuses from storage
			setStatusesFromStorage(context);
		}
		else{				
			context.controls.setDeepLinks(params);				
		}			
	};
	
	// ----------------------- STORAGE ----------------------------------
		
	/**
	* set panel controls statuses from storage
	* @param {Object} context
	*/
	var setStatusesFromStorage = function(context){
		
		var storageStatuses = [] 
			,isStorageEnabled;
		
		isStorageEnabled = (context.options.storage === 'cookies') || ((context.options.storage === 'localstorage') && jQuery.fn.jplist.dal.services.LocalStorageService.supported());
		
		//check storage
		if(isStorageEnabled){
		
			//debug info
			jQuery.fn.jplist.info(context.options, 'Storage enabled: ', context.options.storage);
		
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
				restoreControlsByStatuses(context, storageStatuses);
			}
			else{
				unknownStatusesChanged(context, true);
			}
		}
		else{			
			unknownStatusesChanged(context, true);
		}			
	};
	
	// ----------------------- MAIN LOGIC -------------------------------
	
	/**
	* set control statuses
	* @param {Object} context
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statusesArray
	*/
	var setControlsStatuses = function(context, statusesArray){
		
		var NOT_RESTORED_FROM_COOKIES = false;
		
		//set statuses
		context.controls.setStatuses(statusesArray, NOT_RESTORED_FROM_COOKIES);		

		//save statuses in history
		context.history.addList(statusesArray);
	};
	
	/**
	* unknown status / statuses changed
	* @param {Object} context
	* @param {boolean} isDefault - should it render events by their default statuses
	*/
	var unknownStatusesChanged = function(context, isDefault){
		
		var statuses;			
				
		//get current statuses
		statuses = context.controls.getStatuses(isDefault);
		
		//trigger knownStatusesChanged event
		context.observer.trigger(context.observer.events.knownStatusesChanged, [statuses]);
		
		//try change url according to controls statuses		
		jQuery.fn.jplist.domain.deeplinks.services.DeepLinksService.updateUrlPerControls(context.options, context.controls);
	};
	
	/**
	* restore controls from storage by statuses
	* @param {Object} context
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statusesArray
	*/
	var restoreControlsByStatuses = function(context, statusesArray){
		
		var RESTORED_FROM_COOKIES = true
			,statusesInStorage = [];
		
		for(var i=0; i<statusesArray.length; i++){
			
			if(statusesArray[i].inStorage){
				statusesInStorage.push(statusesArray[i]);
			}
		}		
		
		if(statusesInStorage.length > 0){
		
			//apply statusesInStorage on controls
			context.controls.setStatuses(statusesInStorage, RESTORED_FROM_COOKIES);		
		
			context.observer.trigger(context.observer.events.knownStatusesChanged, [statusesInStorage]);
		}
	};
	
	/**
	* get all statuses and merge them with the given status, then send build statuses event
	* @param {Object} context
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	*/
	var mergeStatuses = function(context, status){
		
		var IS_DEFAULT = false
			,statuses;
		
		if(status.isAnimateToTop){
			animateToTop(context);
		}
		
		statuses = context.controls.merge(IS_DEFAULT, status);
				
		//render html by statuses
		context.observer.trigger(context.observer.events.knownStatusesChanged, [statuses]);	

		
		//try change url according to controls statuses
		jQuery.fn.jplist.domain.deeplinks.services.DeepLinksService.updateUrlPerControls(context.options, context.controls);
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
	* init events
	* @param {Object} context
	*/
	var initEvents = function(context){
			
		/**
		* on plugin init
		*/
		context.observer.on(context.observer.events.init, function(event){		
			pluginInit(context);			
		});
		
		/**
		* event from controller to panel after html rebuild
		*/
		context.observer.on(context.observer.events.statusesAppliedToList, function(event, collection, statusesArray){	
			
			//debug info
			jQuery.fn.jplist.info(context.options, 'panel statusesAppliedToList -> setControlsStatuses: ', statusesArray);
		
			setControlsStatuses(context, statusesArray);
		});
		
		/**
		* one of control statuses was changed
		*/
		context.observer.on(context.observer.events.unknownStatusesChanged, function(event, isDefault){
			
			//debug info
			jQuery.fn.jplist.info(context.options, 'panel statusesChanged, isDefault: ', isDefault);
			
			unknownStatusesChanged(context, isDefault);
		});		
				
		/**
		* event to panel -> get all statuses and merge them with the given status, then send build statuses event
		*/
		context.observer.on(context.observer.events.statusChanged, function(event, status){	

			//debug info
			jQuery.fn.jplist.info(context.options, 'panel statusChanged: ', status);
			
			mergeStatuses(context, status);
		});
		
		/**
		* on 'statuses changed by deep links' event
		*/
		context.observer.on(context.observer.events.statusesChangedByDeepLinks, function(event, oldStatuses, newStatuses, params){

			if(context.controls){
				context.controls.statusesChangedByDeepLinks(params);	
			}			
		});
				
		/**
		* on ios button click -> toggle next panel
		*/
		context.$root.find(context.options.iosBtnPath).on('click', function(){			
			jQuery(this).next(context.options.panelPath).toggleClass('jplist-ios-show');
		});
	};
	
	// ----------------------- ENTRY POINT -------------------------------
	
	/**
	* on plugin init event
	* @param {Object} context
	*/
	var pluginInit = function(context){
		
		//if deep links options is enabled
		if(context.options.deepLinking){
			
			//debug info
			jQuery.fn.jplist.info(context.options, 'Deep linking enabled', '');
				
			//try restore panel state from query string
			setStatusesByDeepLink(context);	
		}
		else{	
			//try set panel controls statuses from storage
			setStatusesFromStorage(context);
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