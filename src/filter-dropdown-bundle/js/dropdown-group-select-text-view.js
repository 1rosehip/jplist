(function(){
	'use strict';	
	
	/**
	* get default option
	* @param {Object} context
	* @param {jQueryObject} $dropdown
	* @return {jQueryObject}
	*/
	var getDefaultOption = function(context, $dropdown){
		
		var $option;
		
		$option = $dropdown.find('option[checked]');
				
		if($option.length <= 0){
			$option = $dropdown.find('option').eq(0);
		}
		
		return $option;
	};
			
	/**
	* reset dropdowns
	* @param {Object} context
	*/
	var resetDropdowns = function(context){
		
		//reset dropdowns
		context.params.$dropdowns.each(function(){
						
			var $dropdown = jQuery(this)
				,$option;
			
			//get default selected option
			$option = getDefaultOption(context, $dropdown);
			
			if($option.length >= 0){
				$option.prop('selected', true);
			}
		});
	};
	
	/**
	* get status by deep link
	* @param {Object} context
	* @param {string} propName - deep link property name
	* @param {string} propValue - deep link property value
	* @return {jQuery.fn.jplist.app.dto.StatusDTO}
	*/
	var getStatusByDeepLink = function(context, propName, propValue){
		
		var isDefault = true
			,status = null
			,sections;

		if(context.inDeepLinking){
		
			//get status
			status = getStatus(context, isDefault);

			if(status.data && propName === 'textGroup'){

				sections = propValue.split(context.options.delimiter2);

				if(sections.length > 0){

					status.data.textGroup = sections;
				}
			}
		}

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
			,value = '';

		if(context.inDeepLinking){
		
			//get status
			status = getStatus(context, isDefault);

			if(status.data && jQuery.isArray(status.data.textGroup) && status.data.textGroup.length > 0){

				for(var i=0; i<status.data.textGroup.length; i++){

					if(value !== ''){
						value += context.options.delimiter2;
					}

					value += status.data.textGroup[i];
				}

				//init deep link
				deepLink = context.name + context.options.delimiter0 + 'textGroup=' + value;
			}
		}

		return deepLink;
	};
	
	/**
	* Get control status
	* @param {Object} context
	* @param {boolean} isDefault - if true, get default (initial) control status; else - get current control status
	* @return {jQuery.fn.jplist.app.dto.StatusDTO}
	*/
	var getStatus = function(context, isDefault){
				
		var textGroup = []
			,data
			,status = null;
		
		context.params.$dropdowns.each(function(){
			
			var $dropdown = jQuery(this)
				,$selected
				,val = '';				
			
			//get selected option (if default, get option with data-default=true or first option)
			if(isDefault){
				
				//get default selected option
				$selected = getDefaultOption(context, $dropdown);
				
				if($selected.length > 0){
					val = $selected.attr('value');
				}
			}
			else{
				val = $dropdown.val();
			}
			
			if(val){
				textGroup.push(val);
			}
		});
				
		//init status related data
		data = new jQuery.fn.jplist.ui.controls.TextFilterDropdownGroupDTO(
			textGroup
			,context.params.mode
			,context.params.dataPath
			,context.params.ignoreRegex
		);
		
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
	* Set control status
	* @param {Object} context
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	* @param {boolean} restoredFromStorage - is status restored from storage
	*/
	var setStatus = function(context, status, restoredFromStorage){
		
		var val
			,$option;
		
		//reset dropdowns
		resetDropdowns(context);
		
		if(status.data && status.data.textGroup && jQuery.isArray(status.data.textGroup) && status.data.textGroup.length > 0){
			
			for(var i=0; i<status.data.textGroup.length; i++){
				
				//get path
				val = status.data.textGroup[i];
				
				$option = context.params.$dropdowns.find('option[value="' + val + '"]');
				
				if($option.length > 0){
					$option.prop('selected', true);
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
		* on dropdown change
		*/
		context.params.$dropdowns.on('change', function(){
			
			//save last status in the history
			context.history.addStatus(getStatus(context, false));
			
			//render statuses
			context.observer.trigger(context.observer.events.unknownStatusesChanged, [false]);
		});
	};
	
	/**
	* Get control paths
	* @param {Object} context
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel>} paths
	*/
	var getPaths = function(context, paths){
		
		var path;

        if(context.params.dataPath){

            //create path object
			path = new jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel(context.params.dataPath, 'text');

            //add path to the paths list
            paths.push(path);
        }
	};
	
	/** 
	* Text Filter Dropdown Group Select Control
	* @constructor
	* @param {Object} context
	*/
	var Init = function(context){
		
		context.params = {			
			$dropdowns: context.$control.find('select')
			
			,mode: context.$control.attr('data-mode') || 'and'
			,dataPath: context.$control.attr('data-path') || ''
			,ignoreRegex: context.$control.attr('data-ignore-regex') || ''
		};
		
		//reset dropdowns
		resetDropdowns(context);
		
		//init events
		initEvents(context);
		
		return jQuery.extend(this, context);
	};
		
	/**
	* Get Paths
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel>} paths
	*/
	Init.prototype.getPaths = function(paths){
		getPaths(this, paths);
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
	* Set Status
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	* @param {boolean} restoredFromStorage - is status restored from storage
	*/
	Init.prototype.setStatus = function(status, restoredFromStorage){
		setStatus(this, status, restoredFromStorage);
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
	* Text Filter Dropdown Group Select Control
	* @constructor
	* @param {Object} context
	*/
	jQuery.fn.jplist.ui.controls.FilterDropdownGroupSelectText = function(context){
		return new Init(context);
	};	
	
	/**
	* static control registration
	*/
	jQuery.fn.jplist.controlTypes['dropdown-select-group-text-fitler'] = {
		className: 'FilterDropdownGroupSelectText'
		,options: {}
		,dropdown: true
	};		
})();

	