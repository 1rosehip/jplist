(function(){
    'use strict';

    /**
     * get value
     * @param {Object} context
     * @param {string} dataType - data type name (title, address, etc.)
     */
    var getValue = function(context, dataType){

        var $el;

        //get value
        $el = context.$store.find('[data-type="' + dataType + '"]');

        //if null?
        if($el.length > 0){
            return $el.text();
        }

        return null;
    };

    /**
     * Store Model
     * @constructor
     * @param {Object} userSettings
     * @param {jQueryElement} $store
     */
    jQuery.fn.jplist.controls.GoogleMapsControl.StoreModel = function($store){

        this.marker = null;

        this.$store = $store;
        this.latitude = Number(this.$store.attr('data-latitude')) || 0;
        this.longitude = Number(this.$store.attr('data-longitude')) || 0;
        this.html = $store.html(); //$store.prop('outerHTML')

        this.title = getValue(this, 'title');
        this.address = getValue(this, 'address');
        this.city = getValue(this, 'city');
        this.state = getValue(this, 'state');
        this.zipcode = getValue(this, 'zipcode');
        this.country = getValue(this, 'country');
    };

    /**
     * open store info window popup on google map
     */
    jQuery.fn.jplist.controls.GoogleMapsControl.StoreModel.prototype.openStorePopup = function(){

        if(this.marker){
            this.marker.openPopup();
        }
    };

    /**
     * close store info window popup on google map
     */
    jQuery.fn.jplist.controls.GoogleMapsControl.StoreModel.prototype.closeStorePopup = function(){

        if(this.marker){
            this.marker.closePopup();
        }
    };

    /**
     * remove store
     */
    jQuery.fn.jplist.controls.GoogleMapsControl.StoreModel.prototype.remove = function(){

        if(this.marker){
            this.marker.remove();
        }
    };

})();