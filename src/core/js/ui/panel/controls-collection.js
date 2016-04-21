/**
* controls collection
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
     * @param {Object} observer
	 */
	var setDeepLinks = function(context, params, observer){
		
		var param
			,controlsWithSameName
			,control
			,status
			,statusesByDeepLinkCollection = new jQuery.fn.jplist.app.dto.StatusesDTOCollection([])
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
		observer.trigger(observer.events.knownStatusesChanged, [statusesByDeepLinkCollection.toArray()]);
		
		//send 'statuses changed by deep links' event
		observer.trigger(observer.events.statusesChangedByDeepLinks, [
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
     * @param {string} delimiter1
	 */
	var getDeepLinksUrl = function(context, delimiter1){
	
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
		url = deepLinksArr.join(delimiter1);
		
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
		
		statuses = new jQuery.fn.jplist.app.dto.StatusesDTOCollection([]);
		
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
		
		return statuses.toArray();
	};
	
	/**
	 * get statuses and merge them with the given status
	 * @param {Object} context
	 * @param {boolean} isDefault - if true, get default (initial) panel status; else - get current panel status
	 * @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statusesToMerge
	 */
	var merge = function(context, isDefault, statusesToMerge){
		
		var statuses
			,statusesCollection;

        statusesCollection = new jQuery.fn.jplist.app.dto.StatusesDTOCollection([]);

        //get current statuses
        statuses = getStatuses(context, isDefault);

        for(var i = 0; i<statuses.length; i++){
            statusesCollection.add(statuses[i], false);
        }

        if(statusesToMerge){

            for(var j=0; j<statusesToMerge.length; j++){

                statusesCollection.add(statusesToMerge[j], true);
            }
        }
				
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
		pathsCollection = new jQuery.fn.jplist.domain.dom.collections.DataItemMemberPathCollection();
		
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
     * @param {jQuery.fn.jplist.app.History} history
     * @param {jQueryObject} $root
     * @param {Object} options - jplist user options
     * @param {Object} observer
	 */
	var add = function(context, $control, history, $root, options, observer){

        var controlFactory
            ,control;

        //init control factory
        controlFactory = new jQuery.fn.jplist.ui.panel.ControlFactory(options, observer, history, $root)

        //create control
        control = controlFactory.create($control, context);
		
		if(control){
			
			//add to the list
			context.controls.push(control);
		}
	};

	/**
	 * get panel controls
	 * @param {Object} context
     * @param {jQueryObject} $controls
     * @param {jQuery.fn.jplist.app.History} history
     * @param {jQueryObject} $root
     * @param {Object} options - jplist user options
     * @param {Object} observer
	 */
	var addList = function(context, $controls, history, $root, options, observer){

        $controls.each(function(){

            //add control to the list
            add(context, jQuery(this), history, $root, options, observer);
        });
	};
	
	/** 
	 * Controls Collection
	 * @constructor
	 * @return {Object}
	 */
	jQuery.fn.jplist.ui.panel.collections.ControlsCollection = function(){

		this.controls = [];
	};
	
	/**
	 * get statuses and merge them with the given status
	 * @param {boolean} isDefault - if true, get default (initial) panel status; else - get current panel status
	 * @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
	 */
	jQuery.fn.jplist.ui.panel.collections.ControlsCollection.prototype.merge = function(isDefault, statuses){
		return merge(this, isDefault, statuses);
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
     * @param {Object} observer
	 */
	jQuery.fn.jplist.ui.panel.collections.ControlsCollection.prototype.setDeepLinks = function(params, observer){
		setDeepLinks(this, params, observer);
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
     * @param {string} delimiter1 (options.delimiter1)
	 * @return {string} url
	 */
	jQuery.fn.jplist.ui.panel.collections.ControlsCollection.prototype.getDeepLinksUrl = function(delimiter1){
		return getDeepLinksUrl(this, delimiter1);
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
	 */
	jQuery.fn.jplist.ui.panel.collections.ControlsCollection.prototype.getPaths = function(){
		return getPaths(this);
	};
	
	/**
	 * add control
	 * @param {jQueryObject} $control
     * @param {jQuery.fn.jplist.app.History} history
     * @param {jQueryObject} $root
     * @param {Object} options - jplist user options
     * @param {Object} observer
	 */
	jQuery.fn.jplist.ui.panel.collections.ControlsCollection.prototype.add = function($control, history, $root, options, observer){
		add(this, $control, history, $root, options, observer);
	};

    /**
     * add control
     * @param {jQueryObject} $controls
     * @param {jQuery.fn.jplist.app.History} history
     * @param {jQueryObject} $root
     * @param {Object} options - jplist user options
     * @param {Object} observer
     */
    jQuery.fn.jplist.ui.panel.collections.ControlsCollection.prototype.addList = function($controls, history, $root, options, observer){
        addList(this, $controls, history, $root, options, observer);
    };
		
})();