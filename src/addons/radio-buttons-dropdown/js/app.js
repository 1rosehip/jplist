(function(){//+
	'use strict';		
	
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
			
			if(status.data && status.data.path){
				
				//init deep link
				deepLink = context.name + context.options.delimiter0 + 'selected=' + status.data.path;
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
		
			//get status
			status = getStatus(context, isDefault);
			
			if(status.data && propName === 'selected'){			
				status.data.path = propValue;
			}
		}
		
		return status;			
	};
	
	/**
	* get radio button with checked attribute
	* @param {Object} context
	* @return {jQueryObject}
	*/
	var getInitialSelectedRadio = function(context){
		
		var $selected = null;
		
		//find first item with checked attribute
		context.params.$radioButtons.each(function(){
			
			var $radio = jQuery(this);
			
			if($radio.attr('checked') !== undefined){
				$selected = $radio;
			}
		});
				
		return $selected;
	};
	
	/**
	* reset control
	* @param {Object} context
	*/
	var reset = function(context){
	
		var $selected;
		
		$selected = getInitialSelectedRadio(context);
		
		if(!$selected){
			$selected = context.params.$radioButtons.eq(0);
		}
		
		if($selected && $selected.length > 0){
			$selected.get(0).checked = true;
		}
	};
	
	/**
	* get selected radio button
	* @param {Object} context
	* @return {jQueryObject}
	*/
	var getSelectedRadio = function(context){
		
		var $selected = null;
		
		//find checked radio
		context.params.$radioButtons.each(function(){
			
			var $radio = jQuery(this);
			
			if($radio.get(0).checked){
				$selected = $radio;
			}
		});
				
		return $selected;
	};
	
	/**
	* set control status
	* @param {Object} context
	* @param {jQuery.fn.jplist.StatusDTO} status
	* @param {boolean} restoredFromStorage - is status restored from storage
	*/
	var setStatus = function(context, status, restoredFromStorage){
		
		var $selected = null;
				
		//try get selected path from status data
		if(status && status.data && status.data.path){			
			$selected = context.params.$radioButtons.filter('[data-path="' + status.data.path + '"]');			
		}
		
		//if selected path not in status data -> get default path
		if(!$selected){
			$selected = getInitialSelectedRadio(context);
		}
		
		if($selected.length > 0){			
			$selected.get(0).checked = true;
		}
		
		//set panel text
		context.params.$panel.text(getSelectedText(context));
	};
	
	/**
	* get control status
	* @param {Object} context
	* @param {boolean} isDefault - if true, get default (initial) control status; else - get current control status
	* @return {jQuery.fn.jplist.StatusDTO}
	*/
	var getStatus = function(context, isDefault){
		
		var status = null
			,$selected = null
			,$default
			,data
			,dataPath;
		
		if(isDefault){	
		
			//find first item with checked attribute
			$selected = getInitialSelectedRadio(context);
		}
		else{
			$selected = getSelectedRadio(context);
		}
		
		if($selected === null && context.params.$radioButtons.length > 0){
			
			//if no radio buttons with checked attribute -> search for 'default'
			$default = context.params.$radioButtons.filter('[data-path="default"]');
			
			if($default.length > 0){
				$selected = $default;
			}
			else{
				//if no 'default' element present -> select first element;
				$selected = context.params.$radioButtons.eq(0);
			}
		}
		
		if($selected){
			dataPath = $selected.attr('data-path');
		}
		else{
			dataPath = '';
		}
		
		data = {
			path: dataPath
			,type: 'TextFilter'
			,filterType: 'path'
		};
		
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
	* get control paths
	* @param {Object} context
	* @param {Array.<jQuery.fn.jplist.PathModel>} paths
	*/
	var getPaths = function(context, paths){
	
		context.params.$radioButtons.each(function(index, el){
			
			var $radio = jQuery(this)
				,dataPath
				,path;
			
			//get data-path
			dataPath = $radio.attr('data-path');
			
			if(dataPath){

				//create path object
				path = new jQuery.fn.jplist.PathModel(dataPath, 'text');

				//add path to the paths list
				paths.push(path);
			}
		});
	};
	
	/**
	* get selected text displayed in control panel
	* @param {Object} context
	* @return {string} panel text
	*/
	var getSelectedText = function(context){
		
		var $selected = null
			,$default
			,selectedText = ''
			,selected;
		
		$selected = getSelectedRadio(context);
		
		if(!($selected) && context.params.$radioButtons.length > 0){
			
			//if no radio button selected -> search for 'default'
			$default = context.params.$radioButtons.filter('[data-path="default"]');
			
			if($default.length > 0){
				$selected = $default;
			}
			else{
				//if no 'default' element appears -> select first element;
				$selected = context.params.$radioButtons.eq(0);
			}
		}	
				
		if($selected.length > 0){
			if($selected.attr('data-path') == 'default'){
				selectedText = context.params.panelAllText;				
			}
			else{
				selected = jQuery.trim($selected.next('label').text());
				selectedText = context.params.panelSelectedText.replace(/{selected}/g, selected);
			}
		}
		
		return selectedText;
	};
	
	/**
	* Init control events
	* @param {Object} context
	*/
	var initEvents = function(context){
				
		/**
		* on input change
		*/
		context.params.$radioButtons.off('change').on('change', function(e){
				
			//render statuses
			context.observer.trigger(context.observer.events.knownStatusesChanged, [[getStatus(context, false)]]);
		});
		
		/**
		* on li click
		*/
		context.$control.find('li').off('click').on('click', function(e){
						
			e.stopPropagation();	
		});
	};
	
	/** 
	* Checkbox Dropdown Control
	* @constructor
	* @param {Object} context
	*/
	var Init = function(context){
		
		context.params = {
			$radioButtons: context.$control.find('[data-path]')
			,$panel: null
			
			//texts
			,panelSelectedText: context.$control.attr('data-panel-selected-text') || ''
			,panelAllText: context.$control.attr('data-panel-all-text') || ''
		};
		
		//reset control
		reset(context);

		//run default dropdown control
		new jQuery.fn.jplist.DropdownControl(context.options, context.observer, context.history, context.$control);

		//get panel
		context.params.$panel = context.$control.find('.jplist-dd-panel');	

		//set panel text first time
		context.params.$panel.text(getSelectedText(context));

		//init events
		initEvents(context);
		
		return jQuery.extend(this, context);
	};
	
	/**
	* get control status
	* @param {boolean} isDefault - if true, get default (initial) control status; else - get current control status
	* @return {jQuery.fn.jplist.StatusDTO}
	*/
	Init.prototype.getStatus = function(isDefault){
		return getStatus(this, isDefault);
	};
	
	/**
	* set Status
	* @param {jQuery.fn.jplist.StatusDTO} status
	* @param {boolean} restoredFromStorage - is status restored from storage
	*/
	Init.prototype.setStatus = function(status, restoredFromStorage){
		setStatus(this, status, restoredFromStorage);
	};
	
	/**
	* get Paths
	* @param {Array.<jQuery.fn.jplist.PathModel>} paths
	*/
	Init.prototype.getPaths = function(paths){
		getPaths(this, paths);
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
	* Checkbox Dropdown Control
	* @constructor
	* @param {Object} context
	*/
	jQuery.fn.jplist.controls.RadioButtonsDropdown = function(context){
		return new Init(context);
	};	
	
	/**
	* static control registration
	*/
	jQuery.fn.jplist.controlTypes['radio-buttons-dropdown'] = {
		className: 'RadioButtonsDropdown'
		,options: {}
		,dropdown: true
	};		
})();

