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
			if(jQuery.isFunction(control.setByDeepLink)){
			
				//add control path to 'paths' array
				control.setByDeepLink(params);
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
			,statusesByDeepLinkCollection = []
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
					status = control.getStatusByDeepLink(param.propName, param.propValue);
					
					if(status){
                        jQuery.fn.jplist.StatusesService.add(statusesByDeepLinkCollection, status, false);
					}
				}
			}
		}
				
		//send build statuses event
		observer.trigger(observer.events.knownStatusesChanged, [statusesByDeepLinkCollection]);
		
		//send 'statuses changed by deep links' event
		observer.trigger(observer.events.statusesChangedByDeepLinks, [
			,statusesByDeepLinkCollection
			,params
		]);	
	};
		
	/**
	 * Set current statuses (for answer event)
	 * @param {Object} context
	 * @param {Array.<jQuery.fn.jplist.StatusDTO>} statuses
	 * @param {boolean} isStorage - are statuses restored from storage
	 */
	var setStatuses = function(context, statuses, isStorage){
		
		var status
			,sameControls
            ,statusMapping = []
            ,map
            ,isAdded;

        //place the statuses with the same name and action in one group
        for(var i=0; i<statuses.length; i++) {

            //get status
            status = statuses[i];

            isAdded = false;

            for(var j=0; j<statusMapping.length; j++){

                if(statusMapping[j].name === status.name && statusMapping[j].action === status.action){

                    isAdded = true;
                    statusMapping[j].statuses.push(status);
                }
            }

            if(!isAdded){

                statusMapping.push({
                    name: status.name
                    ,action: status.action
                    ,statuses: [status]
                });
            }
        }

        for(var j=0; j<statusMapping.length; j++){

            map = statusMapping[j];

            if(map.statuses && map.statuses.length > 0){

                //get controls group (with the status.name and status.action)
                sameControls = findControlsByNameAction(context, map.statuses[0].name, map.statuses[0].action);

                for(var k=0; k<sameControls.length; k++){

                    if(jQuery.isFunction(sameControls[k].setStatus)){

                        if(map.statuses.length > 1){

                            //set control status
                            sameControls[k].setStatus(map.statuses, isStorage);
                        }
                        else{
                            //set control status
                            sameControls[k].setStatus(map.statuses[0], isStorage);
                        }

                    }
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
	 * @return {Array.<jQuery.fn.jplist.StatusDTO>}
	 */
	var getStatuses = function(context, isDefault){
	
		var statuses = []
			,control
			,status;
		
		for(var i=0; i<context.controls.length; i++){
		
			//get control type
			control = context.controls[i];
			
			if(jQuery.isFunction(control.getStatus)){
			
				//get control status
				status = control.getStatus(isDefault);
				
				//add status to the list
				if(status){
				
					//add / merge status
                    jQuery.fn.jplist.StatusesService.add(statuses, status, false);
				}
			}
			
		}
		
		return statuses;
	};
	
	/**
	 * get statuses and merge them with the given status
	 * @param {Object} context
	 * @param {boolean} isDefault - if true, get default (initial) panel status; else - get current panel status
	 * @param {Array.<jQuery.fn.jplist.StatusDTO>} statusesToMerge
	 */
	var merge = function(context, isDefault, statusesToMerge){
		
		var statuses
			,statusesCollection;

        statusesCollection = [];

        //get current statuses
        statuses = getStatuses(context, isDefault);

        for(var i = 0; i<statuses.length; i++){

            jQuery.fn.jplist.StatusesService.add(statusesCollection, statuses[i], false);
        }

        if(statusesToMerge){

            for(var j=0; j<statusesToMerge.length; j++){

                jQuery.fn.jplist.StatusesService.add(statusesCollection, statusesToMerge[j], true);
            }
        }

		return statusesCollection;
	};

    /**
     * Is given path is in the given paths list (compare by jquery path only, data type is ignored)
     * @param {Array.<jQuery.fn.jplist.PathModel>} paths
     * @param {jQuery.fn.jplist.PathModel} path
     * @return {boolean}
     */
    var isPathInList = function(paths, path){

        var cpath
            ,isInList = false
            ,PATH_ONLY = true;

        for(var i=0; i<paths.length; i++){

            //get path
            cpath = paths[i];

            if(cpath.isEqual(path, PATH_ONLY)){
                isInList = true;
                break;
            }
        }

        return isInList;
    };
	
	/**
	 * Get panel paths
	 * @param {Object} context
	 * @return {Array.<jQuery.fn.jplist.PathModel>}
	 */
	var getPaths = function(context){
	
		var control
			,controlsPaths = []
			,paths = [];
		
		for(var i=0; i<context.controls.length; i++){
		
			//get control type
			control = context.controls[i];
			
			//get control type paths
			if(jQuery.isFunction(control.getPaths)){
			
				//add control path to 'controlsPaths' array
				control.getPaths(controlsPaths);

                for(var j=0; j<controlsPaths.length; j++){

                    if(!isPathInList(paths, controlsPaths[j])){

                        paths.push(controlsPaths[j]);
                    }
                };
			}			
		}
		
		return paths;
	};	
		
	/**
	 * add control
	 * @param {Object} context
	 * @param {jQueryObject} $control
     * @param {jQuery.fn.jplist.History} history
     * @param {jQueryObject} $root
     * @param {Object} options - jplist user options
     * @param {Object} observer
     * @return {Object}
	 */
	var add = function(context, $control, history, $root, options, observer){

        var controlFactory
            ,control;

        //init control factory
        controlFactory = new jQuery.fn.jplist.ControlFactory(options, observer, history, $root)

        //create control
        control = controlFactory.create($control, context);
		
		if(control){
			
			//add to the list
			context.controls.push(control);
		}

        return control;
	};

	/**
	 * get panel controls
	 * @param {Object} context
     * @param {jQueryObject} $controls
     * @param {jQuery.fn.jplist.History} history
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
	jQuery.fn.jplist.ControlsCollection = function(){

		this.controls = [];
	};
	
	/**
	 * get statuses and merge them with the given status
	 * @param {boolean} isDefault - if true, get default (initial) panel status; else - get current panel status
	 * @param {Array.<jQuery.fn.jplist.StatusDTO>} statuses
	 */
	jQuery.fn.jplist.ControlsCollection.prototype.merge = function(isDefault, statuses){
		return merge(this, isDefault, statuses);
	};
	
	/**
	 * statuses change per deep links url / params
	 * @param {Array.<Object>} params - array of params {controlName: '...', propName: '...', propValue: '...'}
	 */
	jQuery.fn.jplist.ControlsCollection.prototype.statusesChangedByDeepLinks = function(params){
		statusesChangedByDeepLinks(this, params);
	};
	
	/**
	 * set controls statuses by deep link params
	 * @param {Array.<Object>} params - array of params {controlName: '...', propName: '...', propValue: '...'}
     * @param {Object} observer
	 */
	jQuery.fn.jplist.ControlsCollection.prototype.setDeepLinks = function(params, observer){
		setDeepLinks(this, params, observer);
	};
	
	/**
	 * Set current statuses (for answer event)
	 * @param {Array.<jQuery.fn.jplist.StatusDTO>} statuses
	 * @param {boolean} isStorage - are statuses restored from storage
	 */
	jQuery.fn.jplist.ControlsCollection.prototype.setStatuses = function(statuses, isStorage){
		setStatuses(this, statuses, isStorage);
	};
	
	/**
	 * get deep links url from controls
     * @param {string} delimiter1 (options.delimiter1)
	 * @return {string} url
	 */
	jQuery.fn.jplist.ControlsCollection.prototype.getDeepLinksUrl = function(delimiter1){
		return getDeepLinksUrl(this, delimiter1);
	};
	
	/**
	 * Get current panel statuses (for build statuses event)
	 * @param {boolean} isDefault - if true, get default (initial) panel status; else - get current panel status
	 * @return {Array.<jQuery.fn.jplist.StatusDTO>}
	 */
	jQuery.fn.jplist.ControlsCollection.prototype.getStatuses = function(isDefault){
		return getStatuses(this, isDefault);
	};
	
	/**
	 * Get panel paths
     * @return {Array.<jQuery.fn.jplist.PathModel>}
	 */
	jQuery.fn.jplist.ControlsCollection.prototype.getPaths = function(){
		return getPaths(this);
	};
	
	/**
	 * add control
	 * @param {jQueryObject} $control
     * @param {jQuery.fn.jplist.History} history
     * @param {jQueryObject} $root
     * @param {Object} options - jplist user options
     * @param {Object} observer
	 */
	jQuery.fn.jplist.ControlsCollection.prototype.add = function($control, history, $root, options, observer){
		add(this, $control, history, $root, options, observer);
	};

    /**
     * add control
     * @param {jQueryObject} $controls
     * @param {jQuery.fn.jplist.History} history
     * @param {jQueryObject} $root
     * @param {Object} options - jplist user options
     * @param {Object} observer
     */
    jQuery.fn.jplist.ControlsCollection.prototype.addList = function($controls, history, $root, options, observer){
        addList(this, $controls, history, $root, options, observer);
    };
		
})();