(function(){
    'use strict';

    /**
     * open marker popup
     * @param {Object} context
     */
    var openPopup = function(context){
        window.google.maps.event.trigger(context.gmarker, 'click');
    };

    /**
     * init marker events
     * @param {Object} context
     */
    var initEvents = function(context){

        window.google.maps.event.addListener(context.gmarker, 'click', function(e){

            //close all info windows
            context.observer.trigger('jplist.map.marker.clicked');

            //open current info window
            context.gmarker.infowindow.open(context.map, context.gmarker);
        });
    };

    /**
     * Marker Model
     * @constructor
     * @param {Object} observer
     * @param {number} longitude
     * @param {number} latitude
     * @param {Element} map - map canvas
     * @param {string} title
     * @param {string} popupContent
     */
    jQuery.fn.jplist.controls.GoogleMapsControl.MarkerModel = function(observer, longitude, latitude, map, title, popupContent){

        this.position = new window.google.maps.LatLng(latitude, longitude);
        this.map = map;
        this.observer = observer;
        this.title = title;

        this.gmarker = new window.google.maps.Marker({
            position: this.position
            ,map: this.map
            ,title: this.title
        });

        this.gmarker.infowindow = new window.google.maps.InfoWindow();

        this.gmarker.infowindow.setContent(popupContent);

        //init marker events
        initEvents(this);
    };

    /**
     * open marker popup
     */
    jQuery.fn.jplist.controls.GoogleMapsControl.MarkerModel.prototype.openPopup = function(){
        openPopup(this);
    };

    /**
     * close marker popup
     */
    jQuery.fn.jplist.controls.GoogleMapsControl.MarkerModel.prototype.closePopup = function(){

        if(this.gmarker && this.gmarker.infowindow){
            this.gmarker.infowindow.close();
        }
    };

    /**
     * remove marker from map
     */
    jQuery.fn.jplist.controls.GoogleMapsControl.MarkerModel.prototype.remove = function(){
        this.gmarker.setMap(null);
    };

})();