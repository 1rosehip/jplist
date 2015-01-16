(function(){
	'use strict';
	
	/**
	* jPList publisher / subscriber - handles application events
	* @param {jQueryObject} $root - jplist jquery element
	* @param {Object} options - jplist user options
	* @return {Object}
	* @constructor 
	*/
	var Init = function($root, options){
		
		var context = {
			options: options
			,$root: $root
			,events: {}
		};

		context.events = {
			
			init: '1' //+ this event is sent on plugin init
			,unknownStatusesChanged: '2' //+ constrols, panel and application send this event when one or more unknown statuses are changed
			,knownStatusesChanged: '3' //+ constrols, panel and application send this event when one or more known statuses are changed
			,statusChanged: '4' //+ a given status was changed
			,statusesChangedByDeepLinks: '5' //statuses changed by deep links
						
			//additional action events
			,listSorted: '6' //+ list sort action occurred
			,listFiltered: '7' //+ list filter action occurred
			,listPaginated: '8' //+ list pagination action occurred
			
			//collection events
            ,dataItemAdded: '9' //+ this event is sent by dataitems collection and means that a new data item was added to the dataitems collection
            ,dataItemRemoved: '10' //+ this event is sent by dataitems collection and means that a data item was removed from the dataitems collection
            ,collectionReadyEvent: '11' //+ this event is sent by dataitems collection when all items are added (on plugin init only)
			,statusesAppliedToList: '12' //+ this event is sent by dataitems collection when the statuses were applied to the collection (i.e. sort, filter and pagination is done according new statuses)
			            
			//animation events
			,animationStartEvent: '13'
			,animationStepEvent: '14'
			,animationCompleteEvent: '15'
			
		};			
				
		return jQuery.extend(true, jQuery({}), this, context);
	};
	
	/**
	* jPList publisher / subscriber - handles application events
	* @param {jQueryObject} $root - jplist jquery element
	* @param {Object} options - jplist user options
	* @return {Object}
	* @constructor 
	*/
	jQuery.fn.jplist.app.events.PubSub = function($root, options){
	
		return new Init($root, options);
	};
	
})();