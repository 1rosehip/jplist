;(function(){
    'use strict';

    /**
     * handle place change
     * @param {Object} context
     */
    var handlePlaceChange = function(context){

        var place
            ,status;

        //get selected place
        context.params.place = context.params.autocomplete.getPlace();

        status = getStatus(context, false);

        //update last status
        context.history.addStatus(status);

        context.observer.trigger(context.observer.events.knownStatusesChanged, [[status]]);

    };

    /**
     * init events
     * @param {Object} context
     */
    var initEvents = function(context){

        if(context.params.handler){

            window.google.maps.event.removeListener(context.params.handler);
        }

        /**
         * on autocomplete change
         */
        context.params.handler = window.google.maps.event.addListener(context.params.autocomplete, 'place_changed', function(){

            handlePlaceChange(context);
        });

        /*
        context.$control.off('keyup').on('keyup', function(e){

            var val;

            //get val
            val = $.trim($(this).val());

            if(val === ''){

                context.params.place = null;

                //send panel redraw event
                control.$jplistBox.trigger(control.options.force_ask_event, [false]);
            }
        });*/
    };

    /**
     * Get control status
     * @param {Object} context
     * @param {boolean} isDefault - if true, get default (initial) control status; else - get current control status
     * @return {jQuery.fn.jplist.StatusDTO}
     */
    var getStatus = function(context, isDefault){

        var status = null
            ,data;

        /*
        if(isDefault){

            status = new jQuery.fn.jplist.controls.AutocompleteDTO(
                context.params.latitude
                ,context.params.longitude
                ,context.params.name
                ,context.params.radius);
        }
        else{
            status = new jQuery.fn.jplist.controls.AutocompleteDTO(latitude, longitude, name, radius);
        }
        */

        if(context.params.place) {

            data = new jQuery.fn.jplist.controls.AutocompleteDTO(
                context.params.place.geometry.location['lat']()
                ,context.params.place.geometry.location['lng']()
                ,context.params.place.name
                ,context.params.radius
            );

            //create status object
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
        }

        return status;
    };

    /**
     * Google Maps Autocomplete Control
     * @constructor
     * @param {Object} context
     */
    var Init = function(context){

        context.params = {

            autocomplete: null
            ,place: null

            ,zoom: Number(context.$control.attr('data-zoom')) || 17
            //,latitude: Number(context.$control.attr('data-latitude')) || 0
            //,longitude: Number(context.$control.attr('data-longitude')) || 0
            //,name: context.$control.attr('data-name')
            ,radius: context.$control.attr('data-radius')
        };

        if(window.google && window.google.maps){
            window.google.maps.event.addDomListener(window, 'load', function(){

                //init autocomplete
                context.params.autocomplete = new window.google.maps.places.Autocomplete(context.$control.get(0));

                //init events
                initEvents(context);

            });
        }

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
