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
		
			var status
				,cStatus
				,statusesList;
			
			//pop the current status and statuses list
			status = context.history.popStatus();
			statusesList = context.history.popList();
			
			//get the prev status and statuses list
			status = context.history.getLastStatus();
			statusesList = context.history.getLastList() || [];
			
			if(statusesList && status){
		
				for(var i=0; i<statusesList.length; i++){
				
					//get current status
					cStatus = statusesList[i];
					
					if(cStatus.name === status.name && cStatus.action === status.action){
					 
						/**
						* fix for arrays
						* jQuery extend doesn't replace arrays, it merges them
						*/
						if(cStatus.data){
							for(var property in cStatus.data){
								if(jQuery.isArray(cStatus.data[property])){
									cStatus.data[property] = [];
								}
							}
						}
						
						//merge current status with the given one
						jQuery.extend(true, cStatus, status);
						
						statusesList[i] = cStatus;
					}
				}
				
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
	jQuery.fn.jplist.ui.controls.BackButton = function(context){
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

