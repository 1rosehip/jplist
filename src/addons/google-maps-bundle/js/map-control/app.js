(function(){
    'use strict';

    /**
     * Init control events
     * @param {Object} context
     */
    var initEvents = function(context){

    };

    /**
     * Google Maps Control
     * @constructor
     * @param {Object} context
     */
    var Init = function(context){

        context.params = {


        };

        //init control events
        initEvents(context);

        return jQuery.extend(this, context);
    };

    /**
     * Google Maps Control
     * @constructor
     * @param {Object} context
     */
    jQuery.fn.jplist.controls.GoogleMapsControl = function(context){

        return new Init(context);
    };

    /**
     * control registration in jPList plugin system
     */
    jQuery.fn.jplist.controlTypes['google-maps-control'] = {
        className: 'GoogleMapsControl'
        ,options: {}
    };
})();
