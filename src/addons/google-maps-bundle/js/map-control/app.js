(function(){
    'use strict';

    /**
     * set stores on map
     * @param {Object} context
     * @param {Array.<Object>} items - dataitems pr dataview
     */
    var setStores = function(context, items){

        var item
            ,store
            ,stores = [];

        for(var i=0; i<items.length; i++){

            item = items[i];

            store = new jQuery.fn.jplist.controls.GoogleMapsControl.StoreModel(item.$item);

            stores.push(store);
        }

        context.params.mapView.setStores(stores);
    };

    /**
     * get user settings from HTML
     * @param {Object} context
     * @return {Object}
     */
    var getUserSettings = function(context){

        return {

            //initial state
            latitude: Number(context.$control.attr('data-latitude')) || 0
            ,longitude: Number(context.$control.attr('data-longitude')) || 0
            ,initialZoom: Number(context.$control.attr('data-initil-zoom')) || 2
            ,mapTypeId: context.$control.attr('data-map-type') || 'ROADMAP' //ROADMAP, SATELLITE, HYBRID, TERRAIN
            ,storeZoom: Number(context.$control.attr('data-store-zoom')) || 17
            ,geolocation: context.$control.attr('data-geolocation') === 'true'

            //if info window should be opened on store click
            ,openInfoWindowOnStoreClick: context.$control.attr('data-open-popup-store-click') || false

            ,customMarkerIcon: context.$control.attr('data-marker-icon')
            ,markerText: context.$control.attr('data-marker-text') || 'Click to Zoom'
        };
    };

    /**
     * Init control events
     * @param {Object} context
     */
    var initEvents = function(context){

        /**
         * when all jplist dataitems are collected
         * @param {Object} e - event object
         * @param {jQuery.fn.jplist.Dataitems} collection
         */
        context.observer.on(context.observer.events.collectionReadyEvent, function(e, collection){

            //save data items for the case when all stores should be drawn on the map
            context.params.dataitems = collection.dataitems;

            //set stores on map
            setStores(context, context.params.dataitems);
        });

        /**
         * when jplist dataview changed
         * @param {Object} e - event object
         * @param {jQuery.fn.jplist.Dataitems} collection
         */
        context.observer.on(context.observer.events.statusesAppliedToList, function(e, collection){

            //save data items for the case when all stores should be drawn on the map
            context.params.dataview = collection.dataview;

            //set stores on map
            setStores(context, context.params.dataview);
        });

        /**
         * store onclick
         * @param {Object} e - event object
         * @param {Number} latitude
         * @param {Number} longitude
         */
        context.observer.on('jplist.map.store.clicked', function(e, latitude, longitude){

            context.params.mapView.showStore(latitude, longitude, context.params.userSettings.storeZoom);
        });
    };

    /**
     * Google Maps Control
     * @constructor
     * @param {Object} context
     */
    var Init = function(context){

        context.params = {
            userSettings: {}
            ,mapView: null
            ,storesView: null
            ,dataitems: []
            ,dataview: []
        };

        //collect user settings from HTML data attributes
        context.params.userSettings = getUserSettings(context);

        //init map view
        context.params.mapView = new jQuery.fn.jplist.controls.GoogleMapsControl.MapView(context.params.userSettings, context.observer, context.$control);

        //init stores vew
        context.params.storesView = new jQuery.fn.jplist.controls.GoogleMapsControl.StoresView(context.params.userSettings, context.observer, context.$root.find(context.options.itemsBox), context.options.itemPath);

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
