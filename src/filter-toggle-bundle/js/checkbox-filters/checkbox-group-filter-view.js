(function(){//+
	'use strict';		

	/**
	* Get control status
	* @param {Object} context
	* @param {boolean} isDefault - if true, get default (initial) control status; else - get current control status
	* @return {jQuery.fn.jplist.app.dto.StatusDTO}
	*/
	var getStatus = function(context, isDefault){
		
		var data
			,pathGroup = []
			,status = null
			,selected;	
			
		//init path group
		context.params.$checkboxes.each(function(index, el){
				
			//get checkbox
			var $cb = jQuery(el)
				,dataPath;

			if(isDefault){
				selected = $cb.data('selected-on-start') || false;
			}
			else{
				//get button data
				selected = $cb.get(0).checked;
			}	

			//get data-path
			dataPath = $cb.attr('data-path');

			if(selected && dataPath){
				pathGroup.push(dataPath);
			}
		});			
					
		//init status related data
		data = new jQuery.fn.jplist.ui.controls.CheckboxGroupFilterDTO(pathGroup);
		
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
			,status
			,isDefault = false
			,value = '';
		
		if(context.inDeepLinking){
		
			//get status
			status = getStatus(context, isDefault);
			
			if(status.data && jQuery.isArray(status.data.pathGroup) && status.data.pathGroup.length > 0){
				
				for(var i=0; i<status.data.pathGroup.length; i++){
					
					if(value !== ''){
						value += context.options.delimiter2;
					}
					
					value += status.data.pathGroup[i];
				}
				
				//init deep link
				deepLink = context.name + context.options.delimiter0 + 'pathGroup=' + value;
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
		
		var isDefault = true
			,status = null
			,sections;
			
		if(context.inDeepLinking){
		
			//get status
			status = getStatus(context, isDefault);
			
			if(status.data){
			
				if(propName === 'pathGroup'){
					
					sections = propValue.split(context.options.delimiter2);
					
					if(sections.length > 0){
						
						status.data.pathGroup = sections;
					}
				}
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
		
		context.params.$checkboxes.each(function(index, el){
			
			var $cb = jQuery(this)
				,dataPath
				,path;
			
			//get data-path
			dataPath = $cb.attr('data-path');
			
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
			,$cb;
		
		//reset	all checkboxes
		context.params.$checkboxes.each(function(index, el){
					
			//get button
			$cb = jQuery(el);
			
			//remove selected class
			$cb.removeClass('jplist-selected');
			
			//reset selected value
			$cb.get(0).checked = false;
		});
			
		if(status.data && status.data.pathGroup && jQuery.isArray(status.data.pathGroup) && status.data.pathGroup.length > 0){
			
			for(var i=0; i<status.data.pathGroup.length; i++){
				
				//get path
				path = status.data.pathGroup[i];
				
				$cb = context.params.$checkboxes.filter('[data-path="' + path + '"]');
				
				if($cb.length > 0){
					$cb.addClass('jplist-selected');
					$cb.get(0).checked = true;
				}
			}
		}
	};
	
	/**
	* Init control events
	* @param {Object} context
	*/
	var initEvents = function(context){
			
		context.params.$checkboxes.on('change', function(){
		
			//save last status in the history
			context.history.addStatus(getStatus(context, false));
			
			//render statuses
			context.observer.trigger(context.observer.events.unknownStatusesChanged, [false]);
		});
	};
	
	/** 
	* Dropdown control: sort dropdown, filter dropdown, paging dropdown etc.
	* @constructor
	* @param {Object} context
	*/
	var Init = function(context){
			
		context.params = {
			$checkboxes: context.$control.find('[data-path]')
		};
		
		//in every checkbox: save its data
		context.params.$checkboxes.each(function(){
			
			var $cb = jQuery(this)
				,selected;
			
			selected = $cb.get(0).checked;
			
			if(context.options.deepLinking){			
				selected = false;
			}
			
            $cb.data('selected-on-start', selected);
			$cb.data('mode', $cb.attr('data-mode') || 'contains');
		});
				
		//init events
		initEvents(context);
		
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
	* Checkbox group filter control
	* @constructor
	* @param {Object} context
	*/
	jQuery.fn.jplist.ui.controls.CheckboxGroupFilter = function(context){
		return new Init(context);
	};	
	
	/**
	* static control registration
	*/
	jQuery.fn.jplist.controlTypes['checkbox-group-filter'] = {
		className: 'CheckboxGroupFilter'
		,options: {}
	};		
})();

