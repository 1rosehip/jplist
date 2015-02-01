(function() {
	'use strict';		
	
	//namespace aliases
	var domain = jQuery.fn.jplist.domain;
	
	// HELPERS
	
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
	* Find status by the given field in the statuses array (comparison is not deep, can't compare data object)
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	* @param {string} field - status field name
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
	* @return {number} - index of the status in the status list, or -1 if not found
	* @private
	*/
	var findStatusByField = function(status, field, statuses){
	
		var index = -1
			,cstatus;
		
		for(var i=0; i<statuses.length; i++){
		
			//get dataitem
			cstatus = statuses[i];
			
			if(cstatus[field] === status[field]){
				index = i;
				break;
			}
		}
		
		return index;
	};
	
	/**
	* Merge current statuses list with the given status: if status with the same name and action is found in the list, merge them
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	* @return {Array.<jQuery.fn.jplist.app.dto.StatusDTO>}	
	*/
	var mergeWithStatus = function(statuses, status){
	
		var cStatus;
		
		for(var i=0; i<statuses.length; i++){
		
			//get current status
			cStatus = statuses[i];
			
			if(cStatus.name === status.name && cStatus.action === status.action){
			 
				//merge current status with the given one
				jQuery.extend(true, cStatus, status);
			}
		}
		
		return statuses;
	};

	/**
	* get unique controls
	* @param {Array.<Object>} controls
	* @return {Array.<Object>}
	*/
	var getUniqueControls = function(controls){
				
		var uniqueControls = []
			,control
			,isUnique;
		
		for(var i=0; i<controls.length; i++){
			
			control = controls[i];
			isUnique = true;
			
			for(var j=0; j<uniqueControls.length; j++){
				
				if(uniqueControls[j].name === control.name &&
					uniqueControls[j].action === control.action){
					
					isUnique = false;
					break;
				}
			}
			
			if(isUnique){
				uniqueControls.push(control);
			}
		}
		
		return uniqueControls;
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
			,newStatuses = []
			,oldStatuses
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
						newStatuses.push(status);
					}
				}
			}
		}
				
		//get current statuses
		oldStatuses = getStatuses(context, isDefault);
				
		for(i=0; i<newStatuses.length; i++){			
			mergeWithStatus(oldStatuses, newStatuses[i]);
		}
		
		//send build statuses event
		context.observer.trigger(context.observer.events.knownStatusesChanged, [oldStatuses]);
		
		//send 'statuses changed by deep links' event
		context.observer.trigger(context.observer.events.statusesChangedByDeepLinks, [oldStatuses, newStatuses, params]);
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
		controls = getUniqueControls(context.controls);
		
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
	* Get current panel statuses (for build statuses event)
	* @param {Object} context
	* @param {boolean} isDefault - if true, get default (initial) panel status; else - get current panel status
	* @return {Array.<jQuery.fn.jplist.app.dto.StatusDTO>}
	*/
	var getStatuses = function(context, isDefault){
	
		var statuses = []
			,control
			,status
			,index
			,same_name_status;
		
		for(var i=0; i<context.controls.length; i++){
		
			//get control type
			control = context.controls[i];
			
			if(jQuery.isFunction(control.getStatus)){
			
				//get control status
				status = control['getStatus'](isDefault);
				
				//add status to the list
				if(status){
				
					//search for the statuses with the same name
					index = findStatusByField(status, 'name', statuses);
					
					if(index != -1){
						
						//there is statuses with the same name
						same_name_status = statuses[index];
						
						if(same_name_status.action == status.action){
							
							//same name and different stypes: dropdown pager + pagination pages -> merge statuses
							if(same_name_status.type !== status.type){
								
								jQuery.extend(true, statuses[index], status);
							}
						}
					}
					else{
						//no statuses with the same name ->add to statuses list
						statuses.push(status);
					}				
				}
			}
			
		}
		
		return statuses;
	};
	
	/**
	* get statuses and merge them with the given status
	* @param {Object} context
	* @param {boolean} isDefault - if true, get default (initial) panel status; else - get current panel status
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	*/
	var merge = function(context, isDefault, status){
		
		var statuses;
						
		//get current statuses
		statuses = getStatuses(context, isDefault);
			
		//merge
		statuses = mergeWithStatus(statuses, status);		
			
		return statuses;
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
		pathsCollection = new domain.dom.collections.DataItemMemberPathCollection(context.options, context.observer);
		
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
		
		var control = context.controlFactory.create($control);
		
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
	var Init = function(options, observer, history, $root, $controls){
	
		var context = {
            options: options
			,observer: observer
			,history: history
			,$root: $root
			
			,controlFactory: null
			,$controls: $controls			
			,controls: []
		};
		
		//ini control factory
		context.controlFactory = new jQuery.fn.jplist.ui.panel.ControlFactory(options, observer, history, $root);
		
		//init controls
		initControls(context);
		
		return jQuery.extend(this, context);
	};
	
	/**
	* get statuses and merge them with the given status
	* @param {boolean} isDefault - if true, get default (initial) panel status; else - get current panel status
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	*/
	Init.prototype.merge = function(isDefault, status){		
		return merge(this, isDefault, status);
	};
	
	/**
	* statuses change per deep links url / params
	* @param {Array.<Object>} params - array of params {controlName: '...', propName: '...', propValue: '...'}
	*/
	Init.prototype.statusesChangedByDeepLinks = function(params){		
		statusesChangedByDeepLinks(this, params);
	};
	
	/**
	* set controls statuses by deep link params
	* @param {Array.<Object>} params - array of params {controlName: '...', propName: '...', propValue: '...'}
	*/
	Init.prototype.setDeepLinks = function(params){		
		setDeepLinks(this, params);
	};
	
	/**
	* Set current statuses (for answer event)
	* @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
	* @param {boolean} isStorage - are statuses restored from storage
	*/
	Init.prototype.setStatuses = function(statuses, isStorage){		
		setStatuses(this, statuses, isStorage);
	};
	
	/**
	* get deep links url from controls
	* @return {string} url
	*/
	Init.prototype.getDeepLinksUrl = function(){
		return getDeepLinksUrl(this);
	};
	
	/**
	* Get current panel statuses (for build statuses event)
	* @param {boolean} isDefault - if true, get default (initial) panel status; else - get current panel status
	* @return {Array.<jQuery.fn.jplist.app.dto.StatusDTO>}
	*/
	Init.prototype.getStatuses = function(isDefault){
		return getStatuses(this, isDefault);
	};
	
	/**
	* Get panel paths
	* @return {Array.<jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel>}
	*/
	Init.prototype.getPaths = function(){	
		return getPaths(this);
	};
	
	/**
	* add control
	* @param {jQueryObject} $control
	*/
	Init.prototype.add = function($control){		
		add(this, $control);
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
		return new Init(options, observer, history, $root, $controls);
	};
	
})();