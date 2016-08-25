(function(){
    'use strict';

    /**
     * init events
     * @param {Object} context
     */
    var initEvents = function(context){

        /**
         * on store click
         */
        context.$storesPanel.on('click', context.storePath, function(){

            var $store = $(this);

            context.$storesPanel.find(context.storePath).removeClass('jplist-active-store');

            $store.addClass('jplist-active-store');

            context.observer.trigger('jplist.map.store.clicked', [Number($store.attr('data-latitude')), Number($store.attr('data-longitude'))]);
        });
    };

    /**
     * Stores view
     * @constructor
     * @param {Object} userSettings
     * @param {Object} observer
     * @param {jQueryObject} $storesPanel
     * @param {string} storePath
     */
    jQuery.fn.jplist.controls.GoogleMapsControl.StoresView = function(userSettings, observer, $storesPanel, storePath){

        this.userSettings = userSettings;
        this.observer = observer;
        this.$storesPanel = $storesPanel;
        this.storePath = storePath;

        //init events
        initEvents(this);
    };
})();