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
	* perform API command
	* @param {*} context
	* @param {string} command
	* @param {Object} commandData
	*/	
	var performCommand = function(context, command, commandData){
		
		switch(command){

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
			
			//data source
			,dataSource: {
				
				//data source server side
				server: {
				
					//ajax settings
					ajax:{
						url: 'server.php'
						,dataType: 'html'						
						,type: 'POST'
						//,cache: false
					}
					,serverOkCallback: null
					,serverErrorCallback: null
				}
					
				//render function for json + templates like handlebars, xml + xslt etc.
				,render: null
			}
			
		}, userOptions);
		
		//init pubsub
		context.observer = new jQuery.fn.jplist.PubSub(context.$root, context.options);
				
		//init events - used to save last status
		context.history = new jQuery.fn.jplist.History(context.$root, context.options, context.observer);
				
		//init panel
		context.panel = new jQuery.fn.jplist.PanelController($root, context.options, context.history, context.observer);

        //init storage
        context.storage = new jQuery.fn.jplist.Storage(context.options.storage, context.options.storageName, context.options.cookiesExpiration);

        //init data source
        context.controller = new jQuery.fn.jplist.ServerController(
            context.$root
            ,context.options
            ,context.observer
            ,context.history
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
	
})();