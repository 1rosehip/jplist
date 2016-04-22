/**
* jPList Events
* \core\js\app\events\pubsub.js
*/
;(function(){
	'use strict';
	
	/**
	* jPList publisher / subscriber - handles application events
	* @param {jQueryObject} $root - jplist jquery element
	* @param {Object} options - jplist user options
	* @return {Object}
	* @constructor 
	*/
	jQuery.fn.jplist.PubSub = function($root, options){
	
		var context = {
			options: options
			,$root: $root
			,events: {}
		};

		context.events = {

			unknownStatusesChanged: '1'
			,knownStatusesChanged: '2'
			,statusesChangedByDeepLinks: '3'
						
			//additional action events
			,listSorted: '4' //+ list sort action occurred
			,listFiltered: '5' //+ list filter action occurred
			,listPaginated: '6' //+ list pagination action occurred
			
			//collection events
            ,dataItemAdded: '7' //+ this event is sent by dataitems collection and means that a new data item was added to the dataitems collection
            ,dataItemRemoved: '8' //+ this event is sent by dataitems collection and means that a data item was removed from the dataitems collection
            ,collectionReadyEvent: '9' //+ this event is sent by dataitems collection when all items are added (on plugin init only)
			,statusesAppliedToList: '10' //+ this event is sent by dataitems collection when the statuses were applied to the collection (i.e. sort, filter and pagination is done according new statuses)
			            
			//animation events
			,animationStartEvent: '11'
			,animationStepEvent: '12'
			,animationCompleteEvent: '13'
			
		};			
				
		return jQuery.extend(true, jQuery({}), this, context);
	};
	
})();