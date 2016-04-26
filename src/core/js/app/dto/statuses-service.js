/*
 Statuses Service
 */
;(function() {
    'use strict';

    /**
     * Statuses Service
     */
    jQuery.fn.jplist.StatusesService = jQuery.fn.jplist.StatusesService || {};

    /**
     * Get statuses by action
     * @param {string} action
     * @param {Array.<jQuery.fn.jplist.StatusDTO>} statuses
     * @return {Array.<jQuery.fn.jplist.StatusDTO>}
     */
    jQuery.fn.jplist.StatusesService.getStatusesByAction = function(action, statuses){

        var resultStatuses = []
            ,status;

        for(var i=0; i<statuses.length; i++){

            //get status
            status = statuses[i];

            if(status.action === action){
                resultStatuses.push(status);
            }
        }

        return resultStatuses;
    };

    /**
     * get all sort statuses, expand statuses group if needed
     * @param {Array.<jQuery.fn.jplist.StatusDTO>} statuses
     * @return {Array.<jQuery.fn.jplist.StatusDTO>}
     */
    jQuery.fn.jplist.StatusesService.getSortStatuses = function(statuses){

        var actionStatuses
            ,actionStatus
            ,statusesAfterGroupExpanding = []
            ,tempStatus;

        //get sort statuses
        actionStatuses = jQuery.fn.jplist.StatusesService.getStatusesByAction('sort', statuses);

        if(jQuery.isArray(actionStatuses)){

            for(var i=0; i<actionStatuses.length; i++){

                actionStatus = actionStatuses[i];

                if(actionStatus &&
                    actionStatus.data &&
                    actionStatus.data['sortGroup'] &&
                    jQuery.isArray(actionStatus.data['sortGroup']) &&
                    actionStatus.data['sortGroup'].length > 0){

                    for(var j=0; j<actionStatus.data['sortGroup'].length; j++){

                        tempStatus = new jQuery.fn.jplist.StatusDTO(
                            actionStatus.name
                            ,actionStatus.action
                            ,actionStatus.type
                            ,actionStatus.data['sortGroup'][j]
                            ,actionStatus.inStorage
                            ,actionStatus.inAnimation
                            ,actionStatus.isAnimateToTop
                            ,actionStatus.inDeepLinking
                        );

                        statusesAfterGroupExpanding.push(tempStatus);
                    }
                }
                else{
                    statusesAfterGroupExpanding.push(actionStatus);
                }
            }
        }

        return statusesAfterGroupExpanding;
    };

    /**
     * get all filter statuses that have registered filter services
     * @param {Array.<jQuery.fn.jplist.StatusDTO>} statuses
     * @return {Array.<jQuery.fn.jplist.StatusDTO>}
     */
    jQuery.fn.jplist.StatusesService.getFilterStatuses = function(statuses){

        var filterStatuses
            ,status
            ,filterService
            ,registeredFilterStatuses = [];

        //get filter statuses
        filterStatuses = jQuery.fn.jplist.StatusesService.getStatusesByAction('filter', statuses);

        if(jQuery.isArray(filterStatuses)){

            for(var i=0; i<filterStatuses.length; i++){

                //get status
                status = filterStatuses[i];

                if(status && status.data && status.data.filterType){

                    //get filter service
                    filterService = jQuery.fn.jplist.DTOMapperService.filters[status.data.filterType];

                    if(jQuery.isFunction(filterService)){

                        registeredFilterStatuses.push(status);
                    }
                }
            }
        }

        return registeredFilterStatuses;
    };

    /**
     * Get statuses with the same field: value
     * @param {Array.<jQuery.fn.jplist.StatusDTO>} statuses
     * @param {string} field
     * @param {string|null} value
     * @param {boolean} keepInitialIndex
     * @return {Array.<jQuery.fn.jplist.StatusDTO>}
     */
    var getStatusesByFieldAndValue = function(statuses, field, value, keepInitialIndex){

        var resultStatuses = []
            ,status;

        for(var i=0; i<statuses.length; i++){

            //get status
            status = statuses[i];

            if(status[field] === value){

                if(keepInitialIndex) {
                    status.initialIndex = i;
                }

                resultStatuses.push(status);
            }
        }

        return resultStatuses;
    };

    /**
     * add status
     * @param {Array.<jQuery.fn.jplist.StatusDTO>} statuses
     * @param {jQuery.fn.jplist.StatusDTO} status
     * @param {boolean} force - if this status should be prefered on other statuses
     */
    jQuery.fn.jplist.StatusesService.add = function(statuses, status, force){

        var currentStatus
            ,statusesWithTheSameAction
            ,statusesWithTheSameActionAndName
            ,statusAlreadyExists;

        if(statuses.length === 0){

            //the statuses list os empty
            statuses.push(status);
        }
        else{
            statusesWithTheSameAction = getStatusesByFieldAndValue(statuses, 'action', status.action, true);

            if(statusesWithTheSameAction.length === 0){

                //all statuses have different actions
                statuses.push(status);
            }
            else{
                statusesWithTheSameActionAndName = getStatusesByFieldAndValue(statusesWithTheSameAction, 'name', status.name, false);

                if(statusesWithTheSameActionAndName.length === 0){

                    //there are statuses with the same action, but all names are different
                    //for example it could be checkbox filters and radio buttons filters
                    statuses.push(status);
                }
                else{

                    statusAlreadyExists = false;

                    //there are statuses with the same action and name
                    for(var i = 0; i<statusesWithTheSameActionAndName.length; i++){

                        currentStatus = statusesWithTheSameActionAndName[i];

                        if(currentStatus.type === status.type){

                            statusAlreadyExists = true;

                            //if type is the same - the statuses are identical
                            //it could be the same control in the top and bottom panels
                            if(force){
                                statuses[currentStatus.initialIndex] = status;
                            }
                        }
                        else{

                            //the same name and action, but different type
                            //it could be pagination control and items per page dropdown control
                            //statuses.push(status);

                            //merge
                            //statuses[currentStatus.initialIndex] = jQuery.extend(true, {}, currentStatus, status);
                            //statuses[currentStatus.initialIndex].type = 'combined';
                        }
                    }

                    if(!statusAlreadyExists){

                        statuses.push(status);
                    }
                }
            }
        }
    };

})();