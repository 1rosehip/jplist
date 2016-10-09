(function(){//+
	'use strict';		
	
	/**
	* Render control html
	* @param {Object} context
	*/
	var render = function(context){
		
		if(!context.history.statusesQueue || context.history.statusesQueue.length <= 0){
			context.$control.addClass('jplist-disabled');
		}
		else{
			context.$control.removeClass('jplist-disabled');
		}
	};
	
	/**
	* Init control events
	* @param {Object} context
	*/
	var initEvents = function(context){	
		
		/**
		* refresh button class on statuses change
		*/
		context.observer.on(context.observer.events.unknownStatusesChanged, function(){			
			render(context);
		});
		
		/**
		* refresh button class on statuses change
		*/
		context.observer.on(context.observer.events.knownStatusesChanged, function(){
			render(context);
		});
		
		/**
		* on control click
		*/
		context.$control.on('click', function(){
		
			var statusesList;
			
			//pop the current statuses list
			context.history.popList();
			
			//get the prev statuses list
			statusesList = context.history.getLastList() || [];

            context.observer.one(context.observer.events.statusesAppliedToList, function(){

                //pop statuses list that will be added by the following knownStatusesChanged / unknownStatusesChanged
                context.history.popList();
            });

			if(statusesList){

                context.observer.trigger(context.observer.events.knownStatusesChanged, [statusesList]);
			}
			else{

				//force build statuses event			
				context.observer.trigger(context.observer.events.unknownStatusesChanged, [true]);
			}
			
			//refresh button class
			render(context);

		});
	};

	/** 
	* Back Button Control
	* @constructor
	* @param {Object} context
	*/
	var Init = function(context){
				
		//render control's html
		render(context);
		
		//init events
		initEvents(context);
		
		return jQuery.extend(this, context);
	};

	/** 
	* back button
	* @constructor
	* @param {Object} context
	*/
	jQuery.fn.jplist.controls.BackButton = function(context){
		return new Init(context);
	};	
		
	/**
	* static control registration
	*/
	jQuery.fn.jplist.controlTypes['back-button'] = {
		className: 'BackButton'
		,options: {}
	};
})();

