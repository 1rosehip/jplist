/**
 * DTO Mapper Service Addon
 */
;(function(){
    'use strict';

    jQuery.fn.jplist.DTOMapperService = jQuery.fn.jplist.DTOMapperService || {};
    jQuery.fn.jplist.DTOMapperService.filters = jQuery.fn.jplist.DTOMapperService.filters || {};
    /**
     * autocomplete filter dto mapper
     * @param {jQuery.fn.jplist.StatusDTO} status
     * @param {Array.<jQuery.fn.jplist.DataItemModel>} dataview
     * @return {Array.<jQuery.fn.jplist.DataItemModel>} dataview
     */
    jQuery.fn.jplist.DTOMapperService.filters.AutocompleteFilter = function(status, dataview){

        return jQuery.fn.jplist.FiltersService.autocompleteFilter(
            status.data.latitude
            ,status.data.longitude
            ,status.data.name
            ,dataview
            ,status.data.radius
        );
    };
})();

