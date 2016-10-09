(function(){//+
    'use strict';

    /**
     * Get control status
     * @param {Object} context
     * @param {boolean} isDefault - if true, get default (initial) control status; else - get current control status
     * @return {jQuery.fn.jplist.StatusDTO}
     */
    var getStatus = function(context, isDefault){

        var status = null
            ,data
            ,selected
            ,value;

        if(isDefault){

            //if default, get the initial value
            selected = context.params.initialSelected;
        }
        else{
            selected = context.$control.prop('checked');
        }

        if(selected){
            value = context.$control.val();
        }
        else{
            value = '';
        }

        data = new jQuery.fn.jplist.controls.RadioButtonsTextFilterDTO(
            context.params.dataPath
            ,value
            ,selected
            ,context.params.ignore
            ,context.params.mode
            ,context.params.not
            ,context.params.and
            ,context.params.or
        );

        status = new jQuery.fn.jplist.StatusDTO(
            context.name
            ,context.action
            ,context.type
            ,data
            ,context.inStorage
            ,context.inAnimation
            ,context.isAnimateToTop
            ,context.inDeepLinking
        );

        return status;
    };

    /**
     * Get deep link
     * @param {Object} context
     * @return {string} deep link
     */
    var getDeepLink = function(context){

        var deepLink = ''
            ,status = null
            ,isDefault = false;

        if(context.inDeepLinking){

            //get status
            status = getStatus(context, isDefault);

            if(status.data && status.data.selected){

                //init deep link
                deepLink = context.name + context.options.delimiter0 + 'selected=true';
            }
        }

        return deepLink;
    };

    /**
     * get status by deep link
     * @param {Object} context
     * @param {string} propName - deep link property name
     * @param {string} propValue - deep link property value
     * @return {jQuery.fn.jplist.StatusDTO}
     */
    var getStatusByDeepLink = function(context, propName, propValue){

        var isDefault = false
            ,status = null
            ,isSelected;

        if(context.inDeepLinking){

            //get status
            status = getStatus(context, isDefault);

            if(status.data){

                isSelected = (propName === 'selected') && (propValue === 'true');

                if(isSelected){
                    status.data.selected = isSelected;
                    status.data.value = context.$control.val();
                }
            }
        }

        return status;
    };

    /**
     * Get control paths
     * @param {Object} context
     * @param {Array.<jQuery.fn.jplist.PathModel>} paths
     */
    var getPaths = function(context, paths){

        var path;

        if(context.params.dataPath){

            //create path object
            path = new jQuery.fn.jplist.PathModel(context.params.dataPath, 'text');

            //add path to the paths list
            paths.push(path);
        }
    };

    /**
     * set statuses by deep links
     * @param {Object} context
     * @param {Array.<Object>} params - array of params {controlName: '...', propName: '...', propValue: '...'}
     */
    var setByDeepLink = function(context, params){

        //render statuses again
        context.observer.trigger(context.observer.events.knownStatusesChanged, [[getStatus(context, false)]]);
    };

    /**
     * Set control status
     * @param {Object} context
     * @param {jQuery.fn.jplist.StatusDTO} status
     * @param {boolean} restoredFromStorage - is status restored from storage
     */
    var setStatus = function(context, status, restoredFromStorage){

        context.$control.get(0).checked = status.data.selected || false;
    };

    /**
     * Init control events
     * @param {Object} context
     */
    var initEvents = function(context){

        context.$control.on('change', function(){

            var status = getStatus(context, false);

            //force render statuses event
            context.observer.trigger(context.observer.events.knownStatusesChanged, [[status]]);
        });

    };

    /**
     * Dropdown control: sort dropdown, filter dropdown, paging dropdown etc.
     * @constructor
     * @param {Object} context
     */
    var Init = function(context){

        context.params = {
            initialSelected: context.$control.prop('checked')
            ,dataPath: context.$control.attr('data-path')
            ,ignore: context.$control.attr('data-ignore')
            ,mode: context.$control.attr('data-mode') || 'contains'
        };

        if(context.params.mode === 'advanced'){

            context.params.or = context.$control.attr('data-or');
            context.params.and = context.$control.attr('data-and');
            context.params.not = context.$control.attr('data-not');
        }
        else{
            context.params.ignore = context.params.ignore || '[~!@#$%^&*()+=`\'"\/\\_]+' //[^a-zA-Z0-9]+ not letters/numbers: [~!@#$%^&*\(\)+=`\'"\/\\_]+
        }

        //init events
        initEvents(context);

        return jQuery.extend(this, context);
    };

    /**
     * Get control status
     * @param {boolean} isDefault - if true, get default (initial) control status; else - get current control status
     * @return {jQuery.fn.jplist.StatusDTO}
     */
    Init.prototype.getStatus = function(isDefault){
        return getStatus(this, isDefault);
    };

    /**
     * Get Deep Link
     * @return {string} deep link
     */
    Init.prototype.getDeepLink = function(){
        return getDeepLink(this);
    };

    /**
     * Get Paths by Deep Link
     * @param {string} propName - deep link property name
     * @param {string} propValue - deep link property value
     * @return {jQuery.fn.jplist.StatusDTO}
     */
    Init.prototype.getStatusByDeepLink = function(propName, propValue){
        return getStatusByDeepLink(this, propName, propValue);
    };

    /**
     * Get Paths
     * @param {Array.<jQuery.fn.jplist.PathModel>} paths
     */
    Init.prototype.getPaths = function(paths){
        getPaths(this, paths);
    };

    /**
     * Set Status
     * @param {jQuery.fn.jplist.StatusDTO} status
     * @param {boolean} restoredFromStorage - is status restored from storage
     */
    Init.prototype.setStatus = function(status, restoredFromStorage){
        setStatus(this, status, restoredFromStorage);
    };

    /**
     * set statuses by deep links
     * @param {Array.<Object>} params - array of params {controlName: '...', propName: '...', propValue: '...'}
     */
    Init.prototype.setByDeepLink = function(params){
        setByDeepLink(this, params);
    };

    /**
     * Radio button text filter control
     * @constructor
     * @param {Object} context
     */
    jQuery.fn.jplist.controls.RadioButtonsTextFilter = function(context){
        return new Init(context);
    };

    /**
     * static control registration
     */
    jQuery.fn.jplist.controlTypes['radio-buttons-text-filters'] = {
        className: 'RadioButtonsTextFilter'
        ,options: {}
    };
})();