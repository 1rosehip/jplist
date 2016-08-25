(function(){
    'use strict';

    /**
     * Autocomplete DTO Object
     * @constructor
     * @param {number} latitude
     * @param {number} longitude
     * @param {string} name - selected place name
     * @param {number} radius
     */
    jQuery.fn.jplist.controls.AutocompleteDTO = function(latitude, longitude, name, radius){

        return {
            latitude: latitude
            ,longitude: longitude
            ,name: name
            ,radius: radius
            ,filterType: 'AutocompleteFilter'
        };
    };

})();

