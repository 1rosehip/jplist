/**
* controls collection
* \core\js\ui\panel\controls-collection.js
*/
;(function() {
	'use strict';		
			
	/**
	* Find controls with the same name
	* @param {Object} context
	* @param {?string} name
	* @return {Array.<Object>}
	* @private
	*/
	var findControlsByName = function(context, name){
		
		var sameControls = []
			,control;
		
		for(var i=0; i<context.controls.length; i++){
		
			//get control type
			control = context.controls[i];
			
			if(control.name === name){
				sameControls.push(control);
			}
		}
			
		return sameControls;
	};
		
	/**
	* Find controls with the same name and action
	* @param {Object} context
	* @param {?string} name
	* @param {?string} action
	* @return {Array.<Object>}
	* @private
	*/
	var findControlsByNameAction = function(context, name, action){
		
		var sameControls = []
			,control;
		
		for(var i=0; i<context.controls.length; i++){
		
			//get control type
			control = context.controls[i];
			
			if(control.name === name && control.action === action){
				sameControls.push(control);
			}
		}
			
		return sameControls;
	};
	
	/**
	* statuses change per deep links url / params
	* @param {Object} context
	* @param {Array.<Object>} params - array of params {controlName: '...', propName: '...', propValue: '...'}
	*/
	var statusesChangedByDeepLinks = function(context, params){
		
		var control;
			
		for(var i=0; i<context.controls.length; i++){
		
			//get control type
			control = context.controls[i];
			
			//get control 'setByDeepLink' function
			if(jQuery.isFunction(control['setByDeepLink'])){
			
				//add control path to 'paths' array
				control['setByDeepLink'](params);			
			}			
		}
	};
	
	/**
	* set controls statuses by deep link params
	* @param {Object} context
	* @param {Array.<Object>} params - array of params {controlName: '...', propName: '...', propValue: '...'}
	*/
	var setDeepLinks = function(context, params){
		
		var param
			,controlsWithSameName
			,control
			,status
			,statusesByDeepLinkCollection = new jQuery.fn.jplist.app.dto.StatusesDTOCollection(context.options, context.observer, [])
			,isDefault = false
			,i;
		
		for(i=0; i<params.length; i++){
			
			//get param
			param = params[i];
			
			//get all controls with the given name
			controlsWithSameName = findControlsByName(context, param.controlName);
			
			for(var j=0; j<controlsWithSameName.length; j++){
				
				//get control
				control = controlsWithSameName[j];
				
				if(jQuery.isFunction(control.getStatusByDeepLink)){
				
					//set key-value pair
					status = control['getStatusByDeepLink'](param.propName, param.propValue);
					
					if(status){
						statusesByDeepLinkCollection.add(status, false);
					}
				}
			}
		}
				
		//send build statuses event
		context.observer.trigger(context.observer.events.knownStatusesChanged, [statusesByDeepLinkCollection.toArray()]);
		
		//send 'statuses changed by deep links' event
		context.observer.trigger(context.observer.events.statusesChangedByDeepLinks, [
			,statusesByDeepLinkCollection.toArray()
			,params
		]);	
	};
		
	/**
	* Set current statuses (for answer event)
	* @param {Object} context
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
	* @param {boolean} isStorage - are statuses restored from storage	
	*/
	var setStatuses = function(context, statuses, isStorage){
		
		var status
			,sameControls;
		
		for(var i=0; i<statuses.length; i++){
		
			//get status
			status = statuses[i];
			
			//get controls group (with the status.name and status.action)
			sameControls = findControlsByNameAction(context, status.name, status.action);
			
			for(var k=0; k<sameControls.length; k++){
			
				if(jQuery.isFunction(sameControls[k].setStatus)){
				
					//set control status
					sameControls[k]['setStatus'](status, isStorage);	
				}
			}
		}
	};
	
	/**
	* get deep links url from controls
	* @param {Object} context
	* @return {string} url
	*/
	var getDeepLinksUrl = function(context){
	
		var control
			,url = ''
			,deepLinksArr = []
			,deepLink = ''
			,controls;
			
		//get unique controls
		controls = context.controls;
		
		for(var i=0; i<controls.length; i++){
			
			//get control
			control = controls[i];
						
			if(jQuery.isFunction(control.getDeepLink)){
			
				//get deep link
				deepLink = jQuery.trim(control['getDeepLink']());
			}
			
			//add it to the list
			if((deepLink !== '') && (jQuery.inArray(deepLink, deepLinksArr) === -1)){
				deepLinksArr.push(deepLink);
			}
		}
				
		//init deep links url
		url = deepLinksArr.join(context.options.delimiter1);
		
		return url;
	};
	
	/**
	* Get current panel statuses
	* @param {Object} context
	* @param {boolean} isDefault - if true, get default (initial) panel status; else - get current panel status
	* @return {Array.<jQuery.fn.jplist.app.dto.StatusDTO>}
	*/
	var getStatuses = function(context, isDefault){
	
		var statuses
			,control
			,status
			,index
			,sameNameStatus;			
		
		statuses = new jQuery.fn.jplist.app.dto.StatusesDTOCollection(context.options, context.observer, []);
		
		for(var i=0; i<context.controls.length; i++){
		
			//get control type
			control = context.controls[i];
			
			if(jQuery.isFunction(control.getStatus)){
			
				//get control status
				status = control['getStatus'](isDefault);
				
				//add status to the list
				if(status){
				
					//add / merge status
					statuses.add(status, false);
				}
			}
			
		}
		
		//debug info
		jQuery.fn.jplist.info(context.options, 'getStatuses: ', statuses);
		
		return statuses.toArray();
	};
	
	/**
	* get statuses and merge them with the given status
	* @param {Object} context
	* @param {boolean} isDefault - if true, get default (initial) panel status; else - get current panel status
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	*/
	var merge = function(context, isDefault, status){
		
		var statuses
			,statusesCollection;
		
		statusesCollection = new jQuery.fn.jplist.app.dto.StatusesDTOCollection(context.options, context.observer, []);		
		
		//get current statuses
		statuses = getStatuses(context, isDefault);
		
		for(var i = 0; i<statuses.length; i++){
			statusesCollection.add(statuses[i], false);
		}
		
		statusesCollection.add(status, true);
				
		return statusesCollection.toArray();
	};
	
	/**
	* Get panel paths
	* @param {Object} context
	* @return {Array.<jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel>}	
	*/
	var getPaths = function(context){
	
		var control
			,paths = []
			,pathsCollection;
		
		//init empty paths collection
		pathsCollection = new jQuery.fn.jplist.domain.dom.collections.DataItemMemberPathCollection(context.options, context.observer);
		
		for(var i=0; i<context.controls.length; i++){
		
			//get control type
			control = context.controls[i];
			
			//get control type paths
			if(jQuery.isFunction(control.getPaths)){
			
				//add control path to 'paths' array
				control.getPaths(paths);
				
				//add paths to the paths collection
				pathsCollection.addRange(paths);				
			}			
		}
		
		return pathsCollection['paths'];
	};	
		
	/**
	* add control
	* @param {Object} context
	* @param {jQueryObject} $control
	*/
	var add = function(context, $control){
		
		var control = context.controlFactory.create($control, context);
		
		if(control){
			
			//add to the list
			context.controls.push(control);
		}
	};
	
	/**
	* get panel controls
	* @param {Object} context
	*/
	var initControls = function(context){
	
		var $control;
		
		for(var i=0; i<context.$controls.length; i++){
		
			//get jquery control
			$control = context.$controls.eq(i);
			
			//add control to the list
			add(context, $control);
		}
	};
	
	/** 
	* Controls Collection
	* @constructor 
	* @param {Object} options - jplist user options	
	* @param {Object} observer
	* @param {jQuery.fn.jplist.app.History} history
	* @param {jQueryObject} $root
	* @param {jQueryObject} $controls
	* @return {Object}
	*/
	jQuery.fn.jplist.ui.panel.collections.ControlsCollection = function(options, observer, history, $root, $controls){	
	
		this.options = options;
		this.observer = observer;
		this.history = history;
		this.$root = $root;
			
		this.controlFactory = null;
		this.$controls = $controls;			
		this.controls = [];
		
		//ini control factory
		this.controlFactory = new jQuery.fn.jplist.ui.panel.ControlFactory(options, observer, history, $root);
		
		//init controls
		initControls(this);
	};
	
	/**
	* get statuses and merge them with the given status
	* @param {boolean} isDefault - if true, get default (initial) panel status; else - get current panel status
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	*/
	jQuery.fn.jplist.ui.panel.collections.ControlsCollection.prototype.merge = function(isDefault, status){		
		return merge(this, isDefault, status);
	};
	
	/**
	* statuses change per deep links url / params
	* @param {Array.<Object>} params - array of params {controlName: '...', propName: '...', propValue: '...'}
	*/
	jQuery.fn.jplist.ui.panel.collections.ControlsCollection.prototype.statusesChangedByDeepLinks = function(params){		
		statusesChangedByDeepLinks(this, params);
	};
	
	/**
	* set controls statuses by deep link params
	* @param {Array.<Object>} params - array of params {controlName: '...', propName: '...', propValue: '...'}
	*/
	jQuery.fn.jplist.ui.panel.collections.ControlsCollection.prototype.setDeepLinks = function(params){		
		setDeepLinks(this, params);
	};
	
	/**
	* Set current statuses (for answer event)
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
	* @param {boolean} isStorage - are statuses restored from storage
	*/
	jQuery.fn.jplist.ui.panel.collections.ControlsCollection.prototype.setStatuses = function(statuses, isStorage){		
		setStatuses(this, statuses, isStorage);
	};
	
	/**
	* get deep links url from controls
	* @return {string} url
	*/
	jQuery.fn.jplist.ui.panel.collections.ControlsCollection.prototype.getDeepLinksUrl = function(){
		return getDeepLinksUrl(this);
	};
	
	/**
	* Get current panel statuses (for build statuses event)
	* @param {boolean} isDefault - if true, get default (initial) panel status; else - get current panel status
	* @return {Array.<jQuery.fn.jplist.app.dto.StatusDTO>}
	*/
	jQuery.fn.jplist.ui.panel.collections.ControlsCollection.prototype.getStatuses = function(isDefault){
		return getStatuses(this, isDefault);
	};
	
	/**
	* Get panel paths
	* @return {Array.<jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel>}
	*/
	jQuery.fn.jplist.ui.panel.collections.ControlsCollection.prototype.getPaths = function(){	
		return getPaths(this);
	};
	
	/**
	* add control
	* @param {jQueryObject} $control
	*/
	jQuery.fn.jplist.ui.panel.collections.ControlsCollection.prototype.add = function($control){		
		add(this, $control);
	};
		
})();