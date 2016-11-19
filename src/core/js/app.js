/**
 * jPList App
 */
;(function(){
    'use strict';

    /**
     * API: add new control
     * @param {*} context
     * @param {Object} commandData
     */
    var addControl = function(context, commandData){

        if(context &&
            context.panel &&
            context.controller) {

            context.panel.addControl(commandData.$control);
            context.controller.addPaths(context.panel.paths);
        }
    };

    /**
     * API: add data item(s) to the list
     * @param {*} context
     * @param {Object} commandData
     */
    var add = function(context, commandData){

        var index
            ,items;

        if(context &&
            context.controller &&
            context.controller.collection){

            index = context.controller.collection.dataitems.length;

            //index exists and it's in range
            if(jQuery.isNumeric(commandData.index) && commandData.index >= 0 && commandData.index <= context.controller.collection.dataitems.length){

                index = Number(commandData.index);
            }

            //add single item
            if(commandData.$item){

                //add data item to the collection
                context.controller.collection.addDataItem(
                    commandData.$item
                    ,context.controller.collection.paths
                    ,index
                );
            }

            //add range of items
            if(commandData.$items){

                items = commandData.$items;

                if(!jQuery.isArray(items)){

                    items = items.find(context.options.itemPath).addBack(context.options.itemPath);

                    jQuery(items.get().reverse()).each(function(){

                        //add data item to the collection
                        context.controller.collection.addDataItem(
                            jQuery(this)
                            ,context.controller.collection.paths
                            ,index
                        );
                    });
                }
                else{
                    for(var i=items.length-1; i>=0; i--){

                        //add data item to the collection
                        context.controller.collection.addDataItem(
                            items[i]
                            ,context.controller.collection.paths
                            ,index
                        );
                    }
                }
            }

            //redraw dataview with the given statuses
            context.observer.trigger(context.observer.events.unknownStatusesChanged, [false]);
        }
    };

    /**
     * API: remove all data items from the list
     * @param {*} context
     * @param {Object} commandData
     */
    var empty = function(context, commandData){

        if(context &&
            context.controller &&
            context.controller.collection){

            context.controller.collection.empty();

            //redraw dataview with the given statuses
            context.observer.trigger(context.observer.events.unknownStatusesChanged, [false]);
        }
    };

    /**
     * API: del data item from the list
     * @param {*} context
     * @param {Object} commandData
     */
    var del = function(context, commandData){

        var items;

        if(context &&
            context.controller &&
            context.controller.collection){

            //del single item
            if(commandData.$item){

                //del data item from the collection
                context.controller.collection.delDataitem(commandData.$item);

                //remove the item
                commandData.$item.remove();
            }

            //del range of items
            if(commandData.$items){

                items = commandData.$items;

                if(jQuery.isArray(commandData.$items)){

                    //array of jquery elements -> jquery object
                    items = jQuery(commandData.$items).map(function(){
                        return this.toArray();
                    });
                }

                //dek range of items from the collection
                context.controller.collection.delDataitems(items);

                //remove the items
                items.remove();
            }

            //redraw dataview with the given statuses
            context.observer.trigger(context.observer.events.unknownStatusesChanged, [false]);
        }
    };

    /**
     * API: get data items
     * @param {*} context
     * @param {Object} commandData
     */
    var getDataItems = function(context, commandData){

        var dataitems = null;

        if(context.controller && context.controller.collection){
            dataitems = context.controller.collection.dataitems;
        }

        return dataitems;
    };

    /**
     * perform API command
     * @param {*} context
     * @param {string} command
     * @param {Object} commandData
     */
    var performCommand = function(context, command, commandData){

        switch(command){

            case 'add':{
                add(context, commandData);
            }
                break;

            case 'del':{
                del(context, commandData);
            }
                break;

            case 'empty':{
                empty(context, commandData);
            }
                break;

            case 'getDataItems':{
                return getDataItems(context, commandData);
            }
                break;

            case 'addControl':{
                addControl(context, commandData);
            }
                break;
        }
    };

    /**
     * animate to top
     * @param {*} context
     * @param {Array.<jQuery.fn.jplist.StatusDTO>} statuses
     */
    var animateToTop = function(context, statuses){

        var offset
            ,shouldAnimate = false;

        if(statuses){

            for(var i=0; i<statuses.length; i++){

                if(statuses[i].isAnimateToTop){

                    shouldAnimate = true;
                    break;
                }
            }

            if(shouldAnimate){

                //set offset
                offset = jQuery(context.options.animateToTop).offset().top;

                jQuery('html, body').animate({
                    scrollTop: offset
                }, context.options.animateToTopDuration);
            }
        }
    };

    /**
     * init application events
     * @param {*} context
     */
    var initEvents = function(context){

        //a given list of statuses is changed
        //@param {Object} event
        //@param {Array.<jQuery.fn.jplist.StatusDTO>} statusesToMerge
        context.observer.on(context.observer.events.knownStatusesChanged, function(event, statusesToMerge){

            var mergedStatuses;

            if(statusesToMerge){

                mergedStatuses = context.panel.mergeStatuses(statusesToMerge);

                if(mergedStatuses && mergedStatuses.length > 0){

                    //save statuses to storage according to user options (if needed)
                    context.storage.save(mergedStatuses);

                    context.controller.renderStatuses(mergedStatuses, context.history.getLastStatus());

                    //animate to top if needed
                    animateToTop(context, statusesToMerge);
                }
            }
        });

        /**
         * one or more of control statuses are changed
         */
        context.observer.on(context.observer.events.unknownStatusesChanged, function(event, isDefault){

            var statuses;

            //get current statuses
            statuses = context.panel.getStatuses(isDefault);

            if(statuses.length > 0){

                //save statuses to storage according to user options (if needed)
                context.storage.save(statuses);

                context.controller.renderStatuses(statuses, context.history.getLastStatus());

                //animate to top if needed
                //animateToTop(context, statuses);
            }
        });

        /**
         * a given statuses were applied to list
         */
        context.observer.on(context.observer.events.statusesAppliedToList, function(event, collection, statuses){

            context.panel.setStatuses(statuses);

            //try change url according to controls statuses
            jQuery.fn.jplist.DeepLinksService.updateUrlPerControls(context.options, context.panel.getDeepLinksURLPerControls());
        });

        /**
         * statuses were changed by deep links
         */
        context.observer.on(context.observer.events.statusesChangedByDeepLinks, function(event, newStatuses, params){

            context.panel.statusesChangedByDeepLinks(newStatuses, params);
        });

        /**
         * on ios button click -> toggle next panel
         */
        context.$root.find(context.options.iosBtnPath).on('click', function(){

            jQuery(this).next(context.options.panelPath).toggleClass('jplist-ios-show');
        });

    };

    /**
     * jplist constructor
     * @param {Object} userOptions - jplist user options
     * @param {jQueryObject} $root - jplist container
     * @constructor
     */
    var Init = function(userOptions, $root){

        var context = {
            observer: null
            ,panel: null
            ,controller: null
            ,storage: null
            ,$root: $root
        };

        context.options = jQuery.extend(true, {

            //enable/disable logging information
            debug: false

            //jplist API commands
            ,command: 'init'
            ,commandData: {}

            //main options
            ,itemsBox: '.list' //items container jQuery path
            ,itemPath: '.list-item' //jQuery path to the item within the items container
            ,panelPath: '.panel' //panel jQuery path
            ,noResults: '.jplist-no-results' //'no reaults' section jQuery path
            ,redrawCallback: ''
            ,iosBtnPath: '.jplist-ios-button'

            //animate to top - enabled by data-control-animate-to-top="true" attribute in control
            ,animateToTop: 'html, body'
            ,animateToTopDuration: 0 //in milliseconds (1000 ms = 1 sec)

            //animation effects
            ,effect: '' //'', 'fade'
            ,duration: 300
            ,fps: 24

            //save plugin state with storage
            ,storage: '' //'', 'cookies', 'localstorage'
            ,storageName: 'jplist'
            ,cookiesExpiration: -1 //cookies expiration in minutes (-1 = cookies expire when browser is closed)

            //deep linking
            ,deepLinking: false
            ,hashStart: '#' //the start of the hash part, for example it may be '#!key='
            ,delimiter0: ':' //this delimiter is placed after the control name
            ,delimiter1: '|' //this delimiter is placed between key-value pairs
            ,delimiter2: '~' //this delimiter is placed between multiple value of the same key
            ,delimiter3: '!' //additional delimiter

            //history
            ,historyLength: 10

        }, userOptions);

        //init pubsub
        context.observer = new jQuery.fn.jplist.PubSub(context.$root, context.options);

        //init events - used to save last status
        context.history = new jQuery.fn.jplist.History(context.$root, context.options, context.observer);

        //init panel
        context.panel = new jQuery.fn.jplist.PanelController($root, context.options, context.history, context.observer);

        //init storage
        context.storage = new jQuery.fn.jplist.Storage(context.options.storage, context.options.storageName, context.options.cookiesExpiration);

        //init collection of controls located inside the list (like star rating)
        context.itemControls = new jQuery.fn.jplist.ItemControlCollection(
            context.options
            ,context.observer
            ,context.history
            ,context.$root
        );

        context.controller = new jQuery.fn.jplist.DOMController(
            context.$root
            ,context.options
            ,context.observer
            ,context.panel.paths
        );

        //init application events
        initEvents(context);

        //if deep links options is enabled
        if(context.options.deepLinking){

            //try restore panel state from query string
            context.panel.setStatusesByDeepLink();
        }
        else{
            //try set panel controls statuses from storage
            context.panel.setStatusesFromStorage();
        }

        return jQuery.extend(this, context);
    };

    /**
     * jPList main contructor
     * @param {Object} userOptions - jplist user options
     */
    jQuery.fn.jplist = function(userOptions){

        if(userOptions.command && userOptions.command !== 'init'){

            var context;

            context = this.data('jplist');

            if(context){
                return performCommand(context, userOptions.command, userOptions.commandData);
            }
        }
        else{
            return this.each(function(){

                var context
                    ,$root = jQuery(this);

                context = new Init(userOptions, $root);
                $root.data('jplist', context);
            });
        }
    };

    //API NAMESPACE REGISTRATION
    jQuery.jplist = {};

    //PLUGINS AND CONTROLS REGISTRATION ----------------------------
    jQuery.fn.jplist.controls = jQuery.fn.jplist.controls || {};
    jQuery.fn.jplist.itemControls = jQuery.fn.jplist.itemControls || {};
    jQuery.fn.jplist.controlTypes = {};
    jQuery.fn.jplist.itemControlTypes = {};
    jQuery.fn.jplist.settings = {};

    //NAMESPACES
    jQuery.fn.jplist.FiltersService = jQuery.fn.jplist.FiltersService || {};
    jQuery.fn.jplist.SortService = jQuery.fn.jplist.SortService || {};

})();