(function(){//+
	'use strict';		
	
	/**
	* get first selected button - used for single data mode
	* @param {Object} context
	* @return {jQueryObject}
	*/
	var getFirstSelectedButton = function(context){
		
		var $selected;
		
		$selected = context.params.$buttons.filter('[data-selected="true"]');

        /*
		if($selected.length <= 0){
			$selected = context.params.$buttons.eq(0);
		}
		*/
		
		return $selected;
	};
	
	/**
	* Render control html
	* @param {Object} context
	*/
	var render = function(context){
		
		var $selected;
		
		//deselect all buttons
		context.params.$buttons.data(context.params.DATA_NAME, false);
		 
		//in single mode -> select a button
		if(context.params.mode === 'single'){
			
			$selected = getFirstSelectedButton(context);

            if($selected && $selected.length > 0) {
                $selected.data(context.params.DATA_NAME, true);
            }
		}
	};
	
	/**
	* Get control status
	* @param {Object} context
	* @param {boolean} isDefault - if true, get default (initial) control status; else - get current control status
	* @return {jQuery.fn.jplist.StatusDTO}
	*/
	var getStatus = function(context, isDefault){
		
		var status = null
			,groupData = []
			,$selected
			,buttonData;		
		
		context.params.$buttons.each(function(){
				
			var $btn = jQuery(this)
				,selected;
			
			if(isDefault){
				selected = $btn.attr('data-selected') === 'true';
			}
			else{
				selected = $btn.data(context.params.DATA_NAME);
			}

			if(selected){
			
				buttonData = new jQuery.fn.jplist.controls.SortButtonDTO(
					$btn.attr('data-path')
					,$btn.attr('data-type')
					,$btn.attr('data-order')
					,$btn.attr('data-datetime-format')
					,$btn.attr('data-ignore')
					,selected 
				);
				
				groupData.push(buttonData);	
			}				
		});

		if(context.params.mode === 'single' && groupData.length <= 0){

			$selected = getFirstSelectedButton(context);

            if($selected && $selected.length > 0) {

                buttonData = new jQuery.fn.jplist.controls.SortButtonDTO(
                    $selected.attr('data-path')
                    , $selected.attr('data-type')
                    , $selected.attr('data-order')
                    , $selected.attr('data-datetime-format')
                    , $selected.attr('data-ignore')
                    , true
                );

                groupData.push(buttonData);
            }
		}

		status = new jQuery.fn.jplist.StatusDTO(
			context.name
			,context.action
			,context.type
			,new jQuery.fn.jplist.controls.SortButtonsGroupDTO(groupData)
			,context.inStorage
			,context.inAnimation
			,context.isAnimateToTop
			,context.inDeepLinking
		);
		
		return status;		
	};
	
	/**
	* Get deep link
	* @param {Object} context
	* @return {string} deep link
	*/
	var getDeepLink = function(context){
		
		var deepLink = ''
			,status
			,isDefault = false
			,statusItem
			,sections = [];
		
		if(context.inDeepLinking){
		
			//get status
			status = getStatus(context, isDefault);
			
			if(status.data && status.data.sortGroup && status.data.sortGroup.length > 0){
					
				for(var i=0; i<status.data.sortGroup.length; i++){

					//get text and path
					statusItem = status.data.sortGroup[i];
					
					if(statusItem.selected){					
						sections.push(statusItem.path + context.options.delimiter3 + statusItem.type + context.options.delimiter3 + statusItem.order);
					}				
				}
				
				if(sections.length > 0){
					
					//init deep link
					deepLink = context.name + context.options.delimiter0 + 'selected=' + sections.join(context.options.delimiter2);
				}
			}
		}
		
		return deepLink;
	};
	
	/**
	* get status by deep link
	* @param {Object} context
	* @param {string} propName - deep link property name
	* @param {string} propValue - deep link property value
	* @return {jQuery.fn.jplist.StatusDTO}
	*/
	var getStatusByDeepLink = function(context, propName, propValue){
		
		var isDefault = false
			,status = null
			,sections
			,sortGroup;
		
		if(context.inDeepLinking){
		
			//get status
			status = getStatus(context, isDefault);
			
			if(status.data && (propName === 'selected')){
				
				status.data.sortGroup = [];
				
				sections = propValue.split(context.options.delimiter2);
				
				for(var i=0; i<sections.length; i++){
					
					sortGroup = sections[i].split(context.options.delimiter3);
					
					if(sortGroup.length === 3){
					
						status.data.sortGroup.push({
							selected: true
							,path: sortGroup[0]
							,type: sortGroup[1]
							,order: sortGroup[2]
						});
					}
				}
			}
		}
		
		return status;
	};
	
	/**
	* Get control paths
	* @param {Object} context
	* @param {Array.<jQuery.fn.jplist.PathModel>} paths
	*/
	var getPaths = function(context, paths){
		
		context.params.$buttons.each(function(){
			
			var path
				,$btn = jQuery(this)
				,dataPath
				,dataType;
			
			dataPath = $btn.attr('data-path');
			dataType = $btn.attr('data-type');
			
			path = new jQuery.fn.jplist.PathModel(dataPath, dataType);
            paths.push(path);
		});
	};
		
	/**
	* Set control status
	* @param {Object} context
	* @param {jQuery.fn.jplist.StatusDTO} status
	* @param {boolean} restoredFromStorage - is status restored from storage
	*/
	var setStatus = function(context, status, restoredFromStorage){
			
		var statusItem
			,$btn;
		
		//remove selected class
		context.params.$buttons.removeClass('jplist-selected');
		context.params.$buttons.data(context.params.DATA_NAME, false);		
		
		if(status && status.data && status.data.sortGroup){
			
			for(var i=0; i<status.data.sortGroup.length; i++){
				
				statusItem = status.data.sortGroup[i];
								
				if(statusItem.selected){
				
					$btn = context.params.$buttons.filter('[data-path="' + statusItem.path + '"][data-order="' + statusItem.order + '"][data-type="' + statusItem.type + '"]');
					
					if($btn.length > 0){
						$btn.addClass('jplist-selected');
						$btn.data(context.params.DATA_NAME, true);	
					}
				}
			}
		}
	};
	
	/**
	* Init control events
	* @param {Object} context
	*/
	var initEvents = function(context){
		
		/**
		* on button click
		*/
		context.params.$buttons.on('click', function(){
			
			var $btn = jQuery(this)
				,selected
				,status;
				
			if(context.params.mode === 'single'){
				
				//deselect all buttons
				context.params.$buttons.each(function(){					
					jQuery(this).data(context.params.DATA_NAME, false);
				});
				
				//select current button
				$btn.data(context.params.DATA_NAME, true);
			}	
			else{
				selected = $btn.data(context.params.DATA_NAME);			
				$btn.data(context.params.DATA_NAME, !selected);
			}	
			
			status = getStatus(context, false);
			
			//start sorting
			context.observer.trigger(context.observer.events.knownStatusesChanged, [[status]]);
		});
	};
	
	/** 
	* Sort button control
	* @constructor
	* @param {Object} context
	*/
	var Init = function(context){
					
		context.params = {			
			$buttons: context.$control.find('[data-path]')
			,mode: context.$control.attr('data-mode')
			,DATA_NAME: 'jplist.selected'
		};
		
		//render control html
		render(context);
		
		//init events
		initEvents(context);
				
		return jQuery.extend(this, context);
	};
	
	/**
	* Get control status
	* @param {boolean} isDefault - if true, get default (initial) control status; else - get current control status
	* @return {jQuery.fn.jplist.StatusDTO}
	*/
	Init.prototype.getStatus = function(isDefault){
		return getStatus(this, isDefault);
	};
	
	/**
	* Get Deep Link
	* @return {string} deep link
	*/
	Init.prototype.getDeepLink = function(){
		return getDeepLink(this);
	};
	
	/**
	* Get Paths by Deep Link
	* @param {string} propName - deep link property name
	* @param {string} propValue - deep link property value
	* @return {jQuery.fn.jplist.StatusDTO}
	*/
	Init.prototype.getStatusByDeepLink = function(propName, propValue){
		return getStatusByDeepLink(this, propName, propValue);
	};
	
	/**
	* Get Paths
	* @param {Array.<jQuery.fn.jplist.PathModel>} paths
	*/
	Init.prototype.getPaths = function(paths){
		getPaths(this, paths);
	};
	
	/**
	* Set Status
	* @param {jQuery.fn.jplist.StatusDTO} status
	* @param {boolean} restoredFromStorage - is status restored from storage
	*/
	Init.prototype.setStatus = function(status, restoredFromStorage){
		setStatus(this, status, restoredFromStorage);
	};
	
	/** 
	* Sort button control
	* @constructor
	* @param {Object} context
	*/
	jQuery.fn.jplist.controls.SortButtonsGroup = function(context){
		return new Init(context);
	};	
		
	/**
	* static control registration
	*/
	jQuery.fn.jplist.controlTypes['sort-buttons-group'] = {
		className: 'SortButtonsGroup'
		,options: {}
	};
})();

