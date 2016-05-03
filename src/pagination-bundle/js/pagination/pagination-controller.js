(function(){//+
    'use strict';

    /**
     * Get control status
     * @param {Object} context
     * @param {boolean} isDefault - if true, get default (initial) control status; else - get current control status
     * @return {jQuery.fn.jplist.StatusDTO}
     */
    var getStatus = function(context, isDefault){

        var data
            ,status = null
            ,$button
            ,cpage
            ,itemsPerPage
            ,lastStatus
            ,isJumpToStart = false;

        //get active button
        $button = context.$control.find('button[data-active]').eq(0);

        //if no active button -> get first button
        if($button.length <= 0){
            $button = context.$control.find('button').eq(0);
        }

        //get current page
        if(isDefault){

            //by default current page is 0
            cpage = 0;
        }
        else{

            //parse to number
            cpage = Number($button.attr('data-number')) || 0;
        }

        //if jumpToStart option is enabled and last rebuild action was not pagination -> jump to 0
        isJumpToStart = (context.$control.attr('data-jump-to-start') === 'true') || context.controlOptions.jumpToStart;

        if(isJumpToStart){

            lastStatus = context.history.getLastStatus();

            if(lastStatus && lastStatus.type !== 'pagination' && lastStatus.type !== 'views'){
                cpage = 0;
            }
        }

        //init items per page
        itemsPerPage = Number(context.$control.attr('data-items-per-page')) || 0;

        //create status related data
        data = new jQuery.fn.jplist.controls.PaginationDTO(cpage, itemsPerPage);

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

                if(jQuery.isNumeric(status.data.currentPage)){

                    //init deep link
                    deepLink = context.name + context.options.delimiter0 + 'currentPage=' + status.data.currentPage;
                }

                if(context.$control.attr('data-items-per-page')){

                    //the number of items per page is defined within pagination control
                    //as usual - no items per page dropdown control appears on the page
                    if(deepLink){
                        deepLink += context.options.delimiter1;
                    }

                    //init deep link
                    deepLink += context.name + context.options.delimiter0 + 'number=' + status.data.number;
                }
                else{
                    if(jQuery.isNumeric(status.data.number) || status.data.number === 'all'){

                        //init deep link
                        deepLink = context.name + context.options.delimiter0 + 'number=' + status.data.number;
                    }
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

            if(propName !== 'currentPage'){
                return null;
            }

            //get status
            status = getStatus(context, isDefault);

            if(status.data && (propName === 'currentPage')){

                //set current page
                status.data.currentPage = propValue;
            }
        }

        return status;
    };

    /**
     * Set control status
     * @param {Object} context
     * @param {jQuery.fn.jplist.StatusDTO|Array.<jQuery.fn.jplist.StatusDTO>} status
     * @param {boolean} restoredFromStorage - is status restored from storage
     */
    var setStatus = function(context, status, restoredFromStorage){

        var pagingObj;

        if(jQuery.isArray(status)){

            for(var i=0; i<status.length; i++){

                if(status[i].data && status[i].data.paging){

                    pagingObj = status[i].data.paging;
                }
            }
        }
        else{
            if(status.data) {
                pagingObj = status.data.paging;
            }
        }

        if(pagingObj){

            //build pager
            context.params.view.build(pagingObj);
        }
    };

    /**
     * Init control events
     * @param {Object} context
     */
    var initEvents = function(context){

        /**
         * on pagination button click
         */
        context.$control.on('click', 'button', function(){

            var currentPage
                ,status = null
                ,$btn = jQuery(this)
                ,$paginationControls;

            //get current page number
            currentPage = Number($btn.attr('data-number')) || 0;

            //get status
            status = getStatus(context, false);

            //update current page
            status.data.currentPage = currentPage;

            //update active class -> important for deep links
            $paginationControls = context.$root.find('[data-control-type="pagination"]');
            $paginationControls.find('button').removeAttr('data-active');
            $paginationControls.find('button[data-number="' + currentPage + '"]').each(function(){
                jQuery(this).attr('data-active', true)
            });

            //send status event
            context.observer.trigger(context.observer.events.knownStatusesChanged, [[status]]);
        });
    };

    /**
     * Pagination control (for example, contains pagination bullets)
     * @constructor
     * @param {Object} context
     */
    var Init = function(context){

        context.params = {

            view: new jQuery.fn.jplist.controls.PaginationView(context.$control, context.controlOptions)
        };

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
     * Set Status
     * @param {jQuery.fn.jplist.StatusDTO} status
     * @param {boolean} restoredFromStorage - is status restored from storage
     */
    Init.prototype.setStatus = function(status, restoredFromStorage){
        setStatus(this, status, restoredFromStorage);
    };

    /**
     * Pagination control (for example, contains pagination bullets)
     * @constructor
     * @param {Object} context
     */
    jQuery.fn.jplist.controls.Pagination = function(context){
        return new Init(context);
    };

    /**
     * static control registration
     */
    jQuery.fn.jplist.controlTypes['pagination'] = {
        className: 'Pagination'
        ,options: {}
    };
})();
