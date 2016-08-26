(function(){
    'use strict';

    jQuery.fn.jplist.FiltersService = jQuery.fn.jplist.FiltersService || {};

    /**
     * autocomplete filter for google maps bundle
     * distance between the given point and store <= given radius
     * @param {number} latitude
     * @param {number} longitude
     * @param {string} name - the place name
     * @param {Array.<jQuery.fn.jplist.models.Dataitem>} dataview - stores dataview
     * @param {number} radius
     * @return {Array.<jQuery.fn.jplist.DataItemModel>}
     */
    jQuery.fn.jplist.FiltersService.autocompleteFilter = function(latitude, longitude, name, dataview, radius){

        var resultDataview = []
            ,latlng
            ,storeLatLng
            ,distance
            ,dataitem
            ,store
            ,sameCountry;

        if(jQuery.isNumeric(latitude)
            && jQuery.isNumeric(longitude)
            && window.google
            && radius > 0){

            //init latlng
            latlng = new google['maps']['LatLng'](latitude, longitude);

            for(var i=0; i<dataview.length; i++){

                //get store
                dataitem = dataview[i];
                store = new jQuery.fn.jplist.controls.GoogleMapsControl.StoreModel(dataitem.jqElement);

                if(store.country){

                    //check if same country
                    sameCountry = jQuery.trim(store.country.toLowerCase()) == jQuery.trim(name.toLowerCase());
                }
                else{
                    sameCountry = false;
                }

                storeLatLng = new google['maps']['LatLng'](store.latitude, store.longitude);

                //get distance
                distance = window.google.maps.geometry.spherical.computeDistanceBetween(latlng, storeLatLng);

                if(distance <= radius || sameCountry){
                    resultDataview.push(dataitem);
                }
            }

            return resultDataview;
        }
        else{
            return dataview;
        }
    };

})();