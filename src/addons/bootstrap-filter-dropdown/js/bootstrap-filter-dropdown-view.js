;(function(){
    'use strict';

    /**
     * get default button
     * @param {Object} context
     * @return {jQueryObject}
     */
    var getDefaultButton = function(context){

        var $btn;

        $btn = context.params.$buttons.filter('[data-default="true"]').eq(0);

        if($btn.length <= 0){
            $btn = context.params.$buttons.eq(0);
        }

        return $btn;
    };

    /**
     * Get deep link
     * @param {Object} context
     * @return {string} deep link
     */
    var getDeepLink = function(context){

        var deepLink = ''
            ,status
            ,isDefault = false;

        if(context.inDeepLinking){

            //get status
            status = getStatus(context, isDefault);

            if(status.data){

                if(status.data.path){

                    //init deep link
                    deepLink = context.name + context.options.delimiter0 + 'path=' + status.data.path;
                }
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

        var isDefault = true
            ,status = null;

        if(context.inDeepLinking){

            if(propName !== 'path'){
                return null;
            }

            //get status
            status = getStatus(context, isDefault);

            if(status.data){

                if((propName === 'path') && status.data.path){

                    //set value
                    status.data.path = propValue;
                }
            }
        }

        return status;
    };

    /**
     * set statuses by deep links
     * @param {Object} context
     * @param {Array.<Object>} params - array of params {controlName: '...', propName: '...', propValue: '...'}
     */
    var setByDeepLink = function(context, params){

        var param;

        if(params){
            for(var i=0; i<params.length; i++){

                param = params[i];

                if(param['controlName'] === context.name && param['propName'] === 'path' && param['propValue']){

                    context.$control.find('[data-path="' + param['propValue'] + '"]').trigger('click');
                }

            }
        }
    };

    /**
     * Get control status
     * @param {Object} context
     * @param {boolean} isDefault - if true, get default (initial) control status; else - get current control status
     * @return {jQuery.fn.jplist.StatusDTO}
     */
    var getStatus = function(context, isDefault){

        var status = null
            ,$btn
            ,data;

        if(isDefault){

            $btn = getDefaultButton(context);
        }
        else{
            $btn = context.params.$buttons.filter('[data-jplist-selected="true"]');

            if($btn.length <= 0){

                $btn = getDefaultButton(context);
            }
        }

        //init status related data
        data = new jQuery.fn.jplist.controls.BootFilterDropdownDTO(
            $btn.attr('data-path')
        );

        //create status
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
     * update selected
     * @param {Object} context
     * @param {jQueryObject} $btn
     */
    var updateSelected = function(context, $btn){

        if($btn && $btn.length > 0){

            //remove selected attributes
            context.params.$buttons.attr('data-jplist-selected', false);

            $btn.attr('data-jplist-selected', true);

            //update selected text
            context.params.$textBox.text($btn.text());
        }
    };

    /**
     * Set control status
     * @param {Object} context
     * @param {jQuery.fn.jplist.StatusDTO} status
     * @param {boolean} restoredFromStorage - is status restored from storage
     */
    var setStatus = function(context, status, restoredFromStorage){

        var $btn;

        //set active button
        if(status.data.path == 'default'){
            $btn = getDefaultButton(context);
        }
        else{
            $btn = context.params.$buttons.filter('[data-path="' + status.data.path + '"]');
        }

        if($btn.length > 0){
            updateSelected(context, $btn);
        }
    };

    /**
     * Get control paths
     * @param {Object} context
     * @param {Array.<jQuery.fn.jplist.PathModel>} paths
     */
    var getPaths = function(context, paths){

        var jqPath
            ,path;

        context.params.$buttons.each(function(){

            var $btn = jQuery(this);

            //init vars
            jqPath = $btn.attr('data-path');

            //init path
            if(jqPath && jQuery.trim(jqPath) !== ''){

                //init path
                path = new jQuery.fn.jplist.PathModel(jqPath, $btn.attr('data-type'));
                paths.push(path);
            }
        });
    };

    /**
     * Init control events
     * @param {Object} context
     */
    var initEvents = function(context){

        /**
         * on button click
         */
        context.params.$buttons.on('click', function(e){

            var status
                ,$btn = jQuery(this);

            //don't open buttons as links
            e.preventDefault();

            //update selected
            updateSelected(context, $btn);

            status = getStatus(context, false);

            //send status event
            context.observer.trigger(context.observer.events.knownStatusesChanged, [[status]]);
        });
    };

    /**
     * Bootstrap Sort Dropdown Control
     * @constructor
     * @param {Object} context
     */
    var Init = function(context){

        context.params = {
            $textBox: context.$control.find('[data-type="selected-text"]')
            ,$buttons: context.$control.find('[data-path]')
        };

        //init events
        initEvents(context);

        return jQuery.extend(this, context);
    };

    /**
     * Get Paths
     * @param {Array.<jQuery.fn.jplist.PathModel>} paths
     */
    Init.prototype.getPaths = function(paths){
        getPaths(this, paths);
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
     * Set Status
     * @param {jQuery.fn.jplist.StatusDTO} status
     * @param {boolean} restoredFromStorage - is status restored from storage
     */
    Init.prototype.setStatus = function(status, restoredFromStorage){
        setStatus(this, status, restoredFromStorage);
    };

    /**
     * Get Deep Link
     * @return {string} deep link
     */
    Init.prototype.getDeepLink = function(){
        return getDeepLink(this);
    };

    /**
     * set statuses by deep links
     * @param {Array.<Object>} params - array of params {controlName: '...', propName: '...', propValue: '...'}
     */
    Init.prototype.setByDeepLink = function(params){
        setByDeepLink(this, params);
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
     * Bootstrap Filter Dropdown Control
     * @constructor
     * @param {Object} context
     */
    jQuery.fn.jplist.controls.BootFilterDropdown = function(context){
        return new Init(context);
    };

    /**
     * static control registration
     */
    jQuery.fn.jplist.controlTypes['boot-filter-drop-down'] = {
        className: 'BootFilterDropdown'
        ,options: {}
        ,dropdown: true
    };
})();
