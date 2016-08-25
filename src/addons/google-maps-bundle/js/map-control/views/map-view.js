(function(){
    'use strict';

    /**
     * draw store on map
     * @param {Object} context
     * @param {jQuery.fn.jplist.controls.GoogleMapsControl.StoreModel} store
     */
    var setStoreOnMap = function(context, store){

        var marker;

        //create store marker
        store.marker = new jQuery.fn.jplist.controls.GoogleMapsControl.MarkerModel(context.observer, store.longitude, store.latitude, context.mapCanvas, context.userSettings.markerText, store.html);
    };

    /**
     * remove old stores from map
     * @param {Object} context
     */
    var removeOldStores = function(context){

        var store;

        for(var i=0; i<context.stores.length; i++){

            //get marker
            store = context.stores[i];

            //remove the store
            store.remove();
        }

        //empty markers
        context.stores = [];
    };

    /**
     * set stores on map
     * @param {Object} context
     * @param {Array.<jQuery.fn.jplist.controls.GoogleMapsControl.StoreModel>} stores
     */
    var setStores = function(context, stores){

        //clear stores from map
        removeOldStores(context);

        context.stores = stores;

        if(context.mapCanvas) {

            for (var i = 0; i < stores.length; i++) {

                setStoreOnMap(context, stores[i]);
            }
        }
    };

    /**
     * show location on map
     * @param {Object} context
     * @param {number} latitude
     * @param {number} latitude
     * @param {number} zoom
     */
    var showLocation = function(context, latitude, longitude, zoom){

        var latlng = new google.maps.LatLng(latitude, longitude);

        context.mapCanvas.setCenter(latlng);
        context.mapCanvas.setZoom(zoom);
    };

    /**
     * close all store popups
     * @param {Object} context
     */
    var closeAllPopups = function(context){

        for(var i=0; i<context.stores.length; i++){
            context.stores[i].closeStorePopup();
        }
    };

    /**
     * show store on map
     * @param {Object} context
     * @param {number} latitude
     * @param {number} latitude
     * @param {number} zoom
     */
    var showStore = function(context, latitude, longitude, zoom){

        var store;

        //close all info windows
        closeAllPopups(context);

        //find store by location
        for(var i=0; i<context.stores.length; i++){

            store = context.stores[i];

            if(store.latitude === latitude && store.longitude === longitude){

                showLocation(context, latitude, longitude, zoom);

                if(context.userSettings.openInfoWindowOnStoreClick){

                    store.openStorePopup();
                }

                break;
            }
        }
    };

    /**
     * init geolocation
     * @param {Object} context
     */
    var initGeolocation = function(context){

        if(context.userSettings.geolocation && navigator.geolocation){

            navigator.geolocation.getCurrentPosition(function(position){

                //jump to map
                showLocation(context, position.coords.latitude, position.coords.longitude, context.userSettings.storeZoom);
            });
        }
    };

    /**
     * init map
     * @param {Object} context
     */
    var initMap = function(context){

        var pyrmont;

        //init pyrmont
        pyrmont = new google.maps.LatLng(context.userSettings.latitude, context.userSettings.longitude);

        //create map canvas
        context.mapCanvas = new window.google.maps.Map(context.$map.get(0),
            {
                mapTypeId: google.maps.MapTypeId[context.userSettings.mapTypeId]
                ,center: pyrmont
                ,zoom: context.userSettings.initialZoom
            }
        );

        //set stores first time (all dataitems)
        setStores(context, context.stores);

        //init geolocation (if needed)
        initGeolocation(context);
    };

    /**
     * Init control events
     * @param {Object} context
     */
    var initEvents = function(context){

        if(window.google && window.google.maps){
            window.google.maps.event.addDomListener(window, 'load', function(){

                initMap(context);
            });
        }

        /**
         * marker onclick
         * @param {Object} e - event object
         * @param {Number} latitude
         * @param {Number} longitude
         */
        context.observer.on('jplist.map.marker.clicked', function(e, latitude, longitude){

            //close all info windows
            closeAllPopups(context);
        });
    };

    /**
     * Map view
     * @constructor
     * @param {Object} userSettings
     * @param {Object} observer
     * @param {jQueryObject} $map - map root element
     */
    jQuery.fn.jplist.controls.GoogleMapsControl.MapView = function(userSettings, observer, $map){

        this.userSettings = userSettings;
        this.$map = $map;
        this.observer = observer;
        this.mapCanvas = null;
        this.stores = [];

        //init events
        initEvents(this);
    };

    /**
     * show location on map - used for geolocation; used inside showStore;
     * @public
     * @param {number} latitude
     * @param {number} latitude
     * @param {number} zoom
     */
    jQuery.fn.jplist.controls.GoogleMapsControl.MapView.prototype.showLocation = function(latitude, longitude, zoom){
        showLocation(this, latitude, longitude, zoom);
    };

    /**
     * show store on map - used for store click
     * @public
     * @param {number} latitude
     * @param {number} latitude
     * @param {number} zoom
     */
    jQuery.fn.jplist.controls.GoogleMapsControl.MapView.prototype.showStore = function(latitude, longitude, zoom){
        showStore(this, latitude, longitude, zoom);
    };

    /**
     * set stores on map
     * @param {Array.<jQuery.fn.jplist.controls.GoogleMapsControl.StoreModel>} stores
     * @public
     */
    jQuery.fn.jplist.controls.GoogleMapsControl.MapView.prototype.setStores = function(stores){
        setStores(this, stores);
    };
})();