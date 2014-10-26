(function(){
	'use strict';		
	
	/**
	* get all dropdown controls
	* @param {Object} context
	* @return {jQueryObject} $dropdowns
	*/
	var getAllDropdowns = function(context){
		
		var dropdowns = []
			,$dropdowns = jQuery();
		
		jQuery(document).find('[data-control-type]').each(function(){
			
			var $dropdown = jQuery(this)
				,type = $dropdown.attr('data-control-type');
			
			if(type && jQuery.fn.jplist.controlTypes[type] && jQuery.fn.jplist.controlTypes[type]['dropdown']){
				dropdowns.push($dropdown);
			}
		});
		
		for(var i=0; i<dropdowns.length; i++){
			$dropdowns = $dropdowns.add(dropdowns[i]); //add always returns the new element, so we should rewrite the $dropdowns var
		}
		
		return $dropdowns;
	};
	
	/**
	* render dropdown html
	* @param {Object} context
	*/
	var render = function(context){
		
		var $li
			,$span;
			
		//get first li
		$li = context.$control.find('li:eq(0)');
		
		$li.addClass('active');
		$span = $li.find('span');
		
		//init panel
		if(context.$control.find('.jplist-dd-panel').length <= 0){
			context.$control.prepend('<div class="jplist-dd-panel">' + $span.text() + '</div>');	
		}	
	};
	
	/**
	* init events
	* @param {Object} context
	*/
	var initEvents = function(context){
		
		var $dropdowns = getAllDropdowns(context);
		
		if($dropdowns.length > 0){
		
			/**
			* close dropdown on document click
			*/
			jQuery(document).click(function(){
				$dropdowns.find('ul').hide();
			});
			
			/**
			* close other dropdown on click
			*/
			jQuery(document).off(context.DROPDOWN_CLOSE_EVENT).on(context.DROPDOWN_CLOSE_EVENT, function(event, $dropdown){
			
				$dropdowns.each(function(){
					if(!jQuery(this).is($dropdown)){
						jQuery(this).find('ul').hide();
					}
				});
			});
		}
		
		/**
		* on dropdown panel click
		*/
		context.$control.find('.jplist-dd-panel').off().on('click', function(event){
			
			var $dropdown
				,$ul;
				
			//stop propagation
			event.stopPropagation();
			
			$dropdown = jQuery(this).parents('[data-control-type]');	
			$ul = $dropdown.find('ul');
			
			//close other dropdowns
			jQuery(document).trigger(context.DROPDOWN_CLOSE_EVENT, [$dropdown]);
			
			//toggle visibility
			$ul.toggle(0);
		});
		
	};
	
	/** 
	* Dropdown Control
	* @constructor
	* @param {Object} options
	* @param {Object} observer
	* @param {jQuery.fn.jplist.app.History} history
	* @param {jQueryObject} $control - control element
	*/
	var Init = function(options, observer, history, $control){
		
		var context = {
			options: options
			,observer: observer
			,history: history
			,$control: $control
			
			//events
			,DROPDOWN_CLOSE_EVENT: 'dropdown-close-event'
		};
		
		//render control html
		render(context);
		
		//init control events
		initEvents(context);
				
		return jQuery.extend(this, context);
	};
	
	/**
	* Dropdown Control
	* @param {Object} options
	* @param {Object} observer
	* @param {jQuery.fn.jplist.app.History} history
	* @param {jQueryObject} $control - control element
	* @constructor
	*/
	jQuery.fn.jplist.ui.panel.DropdownControl = function(options, observer, history, $control){		
		return new Init(options, observer, history, $control);		
	};
})();

