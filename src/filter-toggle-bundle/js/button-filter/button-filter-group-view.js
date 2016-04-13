(function(){//+
	'use strict';		
	
	/**
	* Get control status
	* @param {Object} context
	* @param {boolean} isDefault - if true, get default (initial) control status; else - get current control status
	* @return {jQuery.fn.jplist.app.dto.StatusDTO}
	*/
	var getStatus = function(context, isDefault){
		
		var storageStatus
			,data
			,pathGroup = []
			,$button
			,dataPath
			,status
            ,selected;

		storageStatus = context.$control.data('storage-status');
		
		if(isDefault && storageStatus){			
			status = storageStatus;
		}
		else{
			context.params.$buttons.each(function(index, el){
					
				//get button
				$button = jQuery(el);

				if(isDefault){
					selected = $button.attr('data-selected') === 'true';
				}
				else{
					//get button data
					selected = $button.data('selected') || false;
				}				

				if(!!selected){

					//get data-path
					dataPath = $button.attr('data-path');

					if(dataPath){
						pathGroup.push(dataPath);
					}
				}
			});
			
		}

		//init status related data
		data = {
             pathGroup: pathGroup
			,filterType: 'pathGroup'
        };

		//init status
		status = new jQuery.fn.jplist.app.dto.StatusDTO(
			context.name
			,context.action
			,context.type
			,data
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
			,deepLinkSelected = ''
			,status
			,isDefault = false
			,path;
		
		if(context.inDeepLinking){
			//get status
			status = getStatus(context, isDefault);
			
			if(status.data && status.data.pathGroup && status.data.pathGroup.length > 0){
					
				for(var i=0; i<status.data.pathGroup.length; i++){

					//get path
					path = status.data.pathGroup[i];
					
					if(i > 0){
						deepLinkSelected += context.options.delimiter2;
					}				

					deepLinkSelected += path;
					
				}
				
				//init deep link
				deepLink = context.name + context.options.delimiter0 + 'selected=' + deepLinkSelected;
			}
		}
		
		return deepLink;
	};
	
	/**
	* get status by deep link
	* @param {Object} context
	* @param {string} propName - deep link property name
	* @param {string} propValue - deep link property value
	* @return {jQuery.fn.jplist.app.dto.StatusDTO}
	*/
	var getStatusByDeepLink = function(context, propName, propValue){
		
		var isDefault = false
			,status = null;
		
		if(context.inDeepLinking){
		
		//get status
		status = getStatus(context, isDefault);
		
			if(status.data && (propName === 'selected')){
							
				status.data.pathGroup = propValue.split(context.options.delimiter2);
			}
		}
		
		return status;
	};
	
	/**
	* Get control paths
	* @param {Object} context
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel>} paths
	*/
	var getPaths = function(context, paths){
	
		var dataPath
			,path;

		context.params.$buttons.each(function(index, el){
							
			//get data-path
			dataPath = jQuery(el).attr('data-path');

			if(dataPath){

				//create path object
				path = new jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel(dataPath, 'text');

				//add path to the paths list
				paths.push(path);
			}
		});
	};
		
	/**
	* Set control status
	* @param {Object} context
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	* @param {boolean} restoredFromStorage - is status restored from storage
	*/
	var setStatus = function(context, status, restoredFromStorage){
				
		 var path
			,$button;

		//reset	all buttons
		context.params.$buttons.each(function(index, el){
					
			//get button
			$button = jQuery(el);
			
			//remove selected class
			$button.removeClass('jplist-selected');
			
			//reset selected value
			$button.data('selected', false);
		});

		if(status.data && status.data.pathGroup && jQuery['isArray'](status.data.pathGroup) && status.data.pathGroup.length > 0){

			for(var i=0; i<status.data.pathGroup.length; i++){

				//get path
				path = status.data.pathGroup[i];

				$button = context.params.$buttons.filter('[data-path="' + path + '"]');

				if($button.length > 0){
					$button.addClass('jplist-selected');
					$button.data('selected', true);
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

			var $button
				,selected;

			//get button
			$button = jQuery(this);

			if(context.params.mode === 'multiple'){
			
				//get selected value
				selected = $button.data('selected') || false;

				//toggle value
				$button.data('selected', !selected);
			}
			else{
				//unselect all buttons
				context.params.$buttons.data('selected', false);
				
				//select current button
				$button.data('selected', true);
			}

			//save last status in the history
			context.history.addStatus(getStatus(context, false));
			
			//render statuses
			context.observer.trigger(context.observer.events.unknownStatusesChanged, [false]);

		});
	};
	
	/**
	* save initial buttons section
	* @param {Object} context
	*/
	var saveInitialSection = function(context){
		
		var $selectedButton;
		
		if(context.params.mode === 'multiple'){
		
			//in every button: save its data
			context.params.$buttons.each(function(){
				
				var $button = jQuery(this)
					,selected;
				
				selected = $button.attr('data-selected') === 'true';
				
				if(context.options.deepLinking){			
					selected = false;
				}
				
				$button.data('selected', selected);
			});
		}
		else{
			
			//set all buttons data to 'not selected'
			context.params.$buttons.data('selected', false);
			
			//single mode: find one last selected button
			$selectedButton = context.params.$buttons.filter('[data-selected="true"]');
			
			if($selectedButton.length > 0){
				$selectedButton = $selectedButton.eq(0);
			}
			else{
				//get first button
				$selectedButton = context.params.$buttons.eq(0);
			}
			
			//set selected button data -> true
			$selectedButton.data('selected', true);	
			$selectedButton.attr('data-selected', true);
			$selectedButton.trigger('click');
		}
	};
	
	/** 
	* Dropdown control: sort dropdown, filter dropdown, paging dropdown etc.
	* @constructor
	* @param {Object} context
	*/
	var Init = function(context){
			
		context.params = {
			$buttons: context.$control.find('[data-button]')
			,mode: context.$control.attr('data-mode') || 'multiple'
		};				
				
		//init events
		initEvents(context);
		
		//save initial buttons section
		saveInitialSection(context);
		
		return jQuery.extend(this, context);
	};
		
	/**
	* Get control status
	* @param {boolean} isDefault - if true, get default (initial) control status; else - get current control status
	* @return {jQuery.fn.jplist.app.dto.StatusDTO}
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
	* @return {jQuery.fn.jplist.app.dto.StatusDTO}
	*/
	Init.prototype.getStatusByDeepLink = function(propName, propValue){
		return getStatusByDeepLink(this, propName, propValue);
	};
	
	/**
	* Get Paths
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel>} paths
	*/
	Init.prototype.getPaths = function(paths){
		getPaths(this, paths);
	};
	
	/**
	* Set Status
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	* @param {boolean} restoredFromStorage - is status restored from storage
	*/
	Init.prototype.setStatus = function(status, restoredFromStorage){
		setStatus(this, status, restoredFromStorage);
	};
		
	/** 
	* Button filter group control
	* @constructor
	* @param {Object} context
	*/
	jQuery.fn.jplist.ui.controls.ButtonFilterGroup = function(context){
		return new Init(context);
	};	
		
	/**
	* static control registration
	*/
	jQuery.fn.jplist.controlTypes['button-filter-group'] = {
		className: 'ButtonFilterGroup'
		,options: {}
	};
})();

