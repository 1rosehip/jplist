(function(){
    'use strict';

    /**
     * Google Maps Autocomplete Control
     * @constructor
     * @param {Object} context
     */
    var Init = function(context){

        context.params = {


        };

        return jQuery.extend(this, context);
    };

    /**
     * Google Maps Autocomplete Control
     * @constructor
     * @param {Object} context
     */
    jQuery.fn.jplist.controls.GoogleAutocompleteControl = function(context){

        return new Init(context);
    };

    /**
     * control registration in jPList plugin system
     */
    jQuery.fn.jplist.controlTypes['google-autocomplete-control'] = {
        className: 'GoogleAutocompleteControl'
        ,options: {}
    };
})();
