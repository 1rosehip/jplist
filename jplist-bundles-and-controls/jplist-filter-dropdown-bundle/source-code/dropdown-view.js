;(function(){
	'use strict';		
			
	/**
	* Get control status
	* @param {Object} context
	* @param {boolean} isDefault - if true, get default (initial) control status; else - get current control status
	* @return {jQuery.fn.jplist.app.dto.StatusDTO}
	*/
	var getStatus = function(context, isDefault){
		
		var status = null
			,data
			,$li
			,$span;
			
		if(isDefault){
					
			$li = context.$control.find('li:has(span[data-default="true"])').eq(0);
			
			if($li.length <= 0){
				$li = context.$control.find('li:eq(0)');
			}
		}
		else{
			$li = context.$control.find('.active');
		}
		
		//get span
		$span = $li.find('span');
		
		//create status related data				
		data = new jQuery.fn.jplist.ui.controls.DropdownFilterDTO($span.attr('data-path'), $span.attr('data-type'));
		
		//create status
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
			,isDefault = false;
		
		if(context.inDeepLinking){
		
			//get status
			status = getStatus(context, isDefault);
			
			if(status.data){
			
				if(status.data.path){
					
					//init deep link
					deepLink = context.name + context.options.delimiter0 + 'path=' + status.data.path;
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
	* @return {jQuery.fn.jplist.app.dto.StatusDTO}
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
			
				if((propName === 'path') && status.data.path){
					
					//set value
					status.data.path = propValue;
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
	
		var jqPath
			,dataType
			,path;
			
		context.$control.find('span').each(function(){
				
			//init vars
			jqPath = jQuery(this).attr('data-path');
			dataType = jQuery(this).attr('data-type');
			
			//init path
			if(jqPath && jQuery.trim(jqPath) !== ''){
			   
			    //init path
				path = new jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel(jqPath, dataType);
				paths.push(path);
			}
		});
	};
		
	/**
	* set statuses by deep links
	* @param {Object} context
	* @param {Array.<Object>} params - array of params {controlName: '...', propName: '...', propValue: '...'}
	*/
	var setByDeepLink = function(context, params){
	
		var param
			,status;
		
		if(params){
			for(var i=0; i<params.length; i++){
				
				param = params[i];
				
				if(param['controlName'] === context.name && param['propName'] === 'path' && param['propValue']){
										
					context.$control.find('[data-path="' + param['propValue'] + '"]').trigger('click');
				}
					
			}
		}
	};
	
	/**
	* Set control status
	* @param {Object} context
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	* @param {boolean} restoredFromStorage - is status restored from storage
	*/
	var setStatus = function(context, status, restoredFromStorage){
		
		var $btn;
		
		if(status && status.data){
			
			$btn = context.$control.find('[data-path="' + status.data.path + '"]');
			
			if($btn && $btn.length > 0){
				updateSelected(context, $btn.parent('li'));
			}
		}
	};
	
	/**
	* update selected
	* @param {Object} context
	* @param {jQueryObject} $li
	*/
	var updateSelected = function(context, $li){
		
		var $liList;		
		
		//get li list
		$liList = context.$control.find('li');
		
		//remove active class
		$liList.removeClass('active');
		
		if(!$li || $li.length <= 0){
			$li = $liList.eq(0);
		}
		
		if($li.length > 0){
		
			$li.addClass('active');
			
			//update dropdown panel
			context.$control.find('.jplist-dd-panel').text($li.eq(0).text());	
		}
	};
	
	/**
	* Init control events
	* @param {Object} context
	*/
	var initEvents = function(context){
		
		/**
		* on li click
		*/
		context.$control.find('li').off('click').on('click', function(){
			
			var status
				,dataPath
				,dataNumber
				,$li = jQuery(this)
				,$span;
						
			//update selected
			updateSelected(context, $li);
			
			status = getStatus(context, false);
			
			//send status event		
			context.observer.trigger(context.observer.events.statusChanged, [status]);
		});
	};
	
	/** 
	* Filter Dropdown Control
	* @constructor
	* @param {Object} context
	*/
	var Init = function(context){
		
		//run default dropdown control
		new jQuery.fn.jplist.ui.panel.DropdownControl(context.options, context.observer, context.history, context.$control);
				
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
	* Get Status by Deep Link
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
	* set statuses by deep links
	* @param {Array.<Object>} params - array of params {controlName: '...', propName: '...', propValue: '...'}
	*/
	Init.prototype.setByDeepLink = function(params){
		setByDeepLink(this, params);
	};
	
	/** 
	* Filter Dropdown Control
	* @constructor
	* @param {Object} context
	*/
	jQuery.fn.jplist.ui.controls.FilterDropdown = function(context){
		return new Init(context);
	};	
		
	/**
	* static control registration
	*/
	jQuery.fn.jplist.controlTypes['filter-drop-down'] = {
		className: 'FilterDropdown'
		,options: {}
		,dropdown: true
	};		
})();

