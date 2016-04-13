;(function(){
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
		params = jQuery.fn.jplist.dal.services.DeepLinksService.getUrlParams(context.options);
		
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
	
	/**
	* get deep links url according to panel controls
	* @param {Object} context
	* @return {string}
	*/
	var getDeepLinksURLPerControls = function(context){
		
		return context.controls['getDeepLinksUrl']();
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
	var setStatuses = function(context, statusesArray){
		
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
	* statuses are changed by deep link
	* @param {Object} context
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} newStatuses
	* @param {Array.<Object>} params - array of params {controlName: '...', propName: '...', propValue: '...'}
	*/
	var statusesChangedByDeepLinks = function(context, newStatuses, params){
		
		if(context.controls){
			context.controls.statusesChangedByDeepLinks(params);	
		}	
	};
	
	// ----------------------- ENTRY POINT / API -------------------------------
		
	/**
	* Panel constructor
	* @param {jQueryObject} $root - jplist jquery element
	* @param {Object} options - jplist options
	* @param {jQuery.fn.jplist.app.History} history
	* @param {Object} observer
	* @constructor 
	*/
	jQuery.fn.jplist.ui.panel.controllers.PanelController = function($root, options, history, observer){
			
		this.options = options;	//user options	
		this.$root = $root; //jplist container
		this.history = history;
		this.observer = observer;
				
		this.$sticky = null;
		this.paths = null; //all paths	
		this.controls = null;
		
		//init controls and paths
		initControlsAndPaths(this);
		
		//find sticky elements
		this.$sticky = $root.find('[data-sticky="true"]');
		
		//init sticky
		if(this.$sticky.length > 0){
			initSticky(this, this.$sticky);
		}
	};
	
	/**
	* try restore panel state from query string
	*/
	jQuery.fn.jplist.ui.panel.controllers.PanelController.prototype.setStatusesByDeepLink = function(){
		setStatusesByDeepLink(this);
	};
	
	/**
	* try set panel controls statuses from storage
	*/
	jQuery.fn.jplist.ui.panel.controllers.PanelController.prototype.setStatusesFromStorage = function(){
		setStatusesFromStorage(this);
	};

	/**
	* set control statuses
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
	*/
	jQuery.fn.jplist.ui.panel.controllers.PanelController.prototype.setStatuses = function(statuses){
		setStatuses(this, statuses);
	};
	
	/**
	* unknown status / statuses changed
	* @param {boolean} isDefault - should it render events by their default statuses
	*/
	jQuery.fn.jplist.ui.panel.controllers.PanelController.prototype.unknownStatusesChanged = function(isDefault){
		unknownStatusesChanged(this, isDefault);
	};

	/**
	* get all statuses and merge them with the given status, then send build statuses event
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	*/
	jQuery.fn.jplist.ui.panel.controllers.PanelController.prototype.mergeStatuses = function(status){
		mergeStatuses(this, status);
	};
	
	/**
	* statuses are changed by deep links
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} newStatuses
	* @param {Array.<Object>} params - array of params {controlName: '...', propName: '...', propValue: '...'}
	*/
	jQuery.fn.jplist.ui.panel.controllers.PanelController.prototype.statusesChangedByDeepLinks = function(newStatuses, params){
		statusesChangedByDeepLinks(this, newStatuses, params);
	};
	
	/**
	* get deep links url according to panel controls
	* @return {string}
	*/
	jQuery.fn.jplist.ui.panel.controllers.PanelController.prototype.getDeepLinksURLPerControls = function(){
		return getDeepLinksURLPerControls(this);
	};
})();