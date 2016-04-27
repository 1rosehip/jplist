(function(){
	'use strict';		
	
	/**
	* get default button
	* @param {Object} context
	* @return {jQueryObject}
	*/
	var getDefaultButton = function(context){
		
		var $btn;
		
		$btn = context.params.$buttons.filter('[data-default="true"]').eq(0);
		
		if($btn.length <= 0){
			$btn = context.params.$buttons.eq(0);
		}
		
		return $btn;
	};
	
	/**
	* Get control status
	* @param {Object} context
	* @param {boolean} isDefault - if true, get default (initial) control status; else - get current control status
	* @return {jQuery.fn.jplist.StatusDTO}
	*/
	var getStatus = function(context, isDefault){
		
		var status = null
			,$btn
			,data;	

		if(isDefault){
		
			$btn = getDefaultButton(context);
		}
		else{
			$btn = context.params.$buttons.filter('[data-jplist-selected="true"]');
		}
		
		//init status related data
		data = new jQuery.fn.jplist.controls.BootstrapDropdownPaginationDTO(
			$btn.attr('data-number')
		);
		
		//create status
		status = new jQuery.fn.jplist.StatusDTO(
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
			,status
			,isDefault = false;
		
		if(context.inDeepLinking){
		
			//get status
			status = getStatus(context, isDefault);
			
			if(status.data){
			
				if(jQuery.isNumeric(status.data.number) || status.data.number === 'all' ){
					
					//init deep link
					deepLink = context.name + context.options.delimiter0 + 'number=' + status.data.number;
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
		
		var isDefault = true
			,status = null;
		
		if(context.inDeepLinking){
		
			if((propName !== 'number') && (propName !== 'path' + context.options.delimiter2 + 'type' + context.options.delimiter2 + 'order') && (propName !== 'path')){			
				return null;
			}
			
			//get status
			status = getStatus(context, isDefault);
			
			if(status.data){
			
				if((propName === 'number') && jQuery.isNumeric(status.data.number)){
					
					//set value
					status.data.number = propValue;
				}	
			}	
		}

		return status;
	};
			
	/**
	* Set control status
	* @param {Object} context
	* @param {jQuery.fn.jplist.StatusDTO|Array.<jQuery.fn.jplist.StatusDTO>} status
	* @param {boolean} restoredFromStorage - is status restored from storage
	*/
	var setStatus = function(context, status, restoredFromStorage){
				
		var $btn = null
            ,itemsPerPage = 0;

        if(jQuery.isArray(status)){

            for(var i=0; i<status.length; i++){

                if(status[i].data && (jQuery.isNumeric(status[i].data.number) || status[i].data.number === 'all')){

                    itemsPerPage = status[i].data.number;
                }
            }
        }
        else{
            if(status.data && (jQuery.isNumeric(status.data.number) || status.data.number === 'all')) {

                itemsPerPage = status.data.number;
            }
        }

		//remove selected attributes
		context.params.$buttons.attr('data-jplist-selected', false);

		//set active button
		if(itemsPerPage === 0){

			$btn = getDefaultButton(context);
		}
		else{
            $btn = context.params.$buttons.filter('[data-number="' + itemsPerPage + '"]');
		}
		
		if($btn.length > 0){

			$btn.attr('data-jplist-selected', true);
			
			//update selected text
			context.params.$textBox.text($btn.text());
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
		context.params.$buttons.on('click', function(e){
		
			var dataNumber
				,status;
			
			//don't open buttons as links
			e.preventDefault();
			
			status = getStatus(context, false);

			dataNumber = jQuery(this).attr('data-number');
			
			if(dataNumber){
				status.data.number = dataNumber;				
			}	

			//send status event			
			context.observer.trigger(context.observer.events.knownStatusesChanged, [[status]]);
		});
	};
	
	/** 
	* Bootstrap Items Per Page Dropdown Control
	* @constructor
	* @param {Object} context
	*/
	var Init = function(context){
				
		context.params = {
			$textBox: context.$control.find('[data-type="selected-text"]')
			,$buttons: context.$control.find('[data-number]')
		};
						
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
	* Set Status
	* @param {jQuery.fn.jplist.StatusDTO} status
	* @param {boolean} restoredFromStorage - is status restored from storage
	*/
	Init.prototype.setStatus = function(status, restoredFromStorage){
		setStatus(this, status, restoredFromStorage);
	};
	
	/** 
	* Bootstrap Items Per Page Dropdown Control
	* @constructor
	* @param {Object} context
	*/
	jQuery.fn.jplist.controls.BootstrapItemsPerPageDropdown = function(context){
		return new Init(context);
	};	
	
	/**
	* static control registration
	*/
	jQuery.fn.jplist.controlTypes['boot-items-per-page-dropdown'] = {
		className: 'BootstrapItemsPerPageDropdown'
		,options: {}
		,dropdown: true
	};		
})();

