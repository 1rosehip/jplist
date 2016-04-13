(function(){
	'use strict';	
	
	/**
	* enter key
	* @param {Object} context
	*/
	var enter = function(context){
		
		var $dataItems
			,$activeItem = null
			,href;
		
		//get all data items
		$dataItems = context.$placeholder.children();
		
		if($dataItems.length > 0){
			
			//get active data-item
			$activeItem = $dataItems.filter('.autocomplete-active');
			
			/*
			if($activeItem.length <= 0){
				$activeItem = $dataItems.eq(0);				
			}
			*/
		}
				
		if($activeItem){
		
			href = $activeItem.attr('href');
			
			if(href){
				window.location.href = href;
			}
			else{
				$activeItem.trigger('click');
			}
		}
	};
	
	/**
	* set up/down
	* @param {Object} context
	* @param {string} direction - up/down
	*/
	var setUpDown = function(context, direction){
		
		var $dataItems
			,$activeItem
			,activeItemIndex
			,$nextItem
			,$prevItem;
		
		if(context.$placeholder.is(':visible')){
			
			//get all data items
			$dataItems = context.$placeholder.children();			
			
			if($dataItems.length > 0){				
			
				activeItemIndex = -1;
				
				$dataItems.each(function(index, el){
					
					var $el = jQuery(el);
				
					if($el.hasClass('autocomplete-active')){
						
						activeItemIndex = index;
						$activeItem = $el;
					}
				});
				
				//remove active class from all the items
				$dataItems.removeClass('autocomplete-active');
				
				//UP
				if(direction === 'up'){
					
					if(activeItemIndex !== -1){
						
						//get prev item
						if(activeItemIndex - 1 >= 0){
							$prevItem = $dataItems.eq(activeItemIndex - 1);
							$prevItem.addClass('autocomplete-active');
						}
						else{
							$activeItem.addClass('autocomplete-active');
						}				
					}
				}
				else{
					
					if(activeItemIndex === -1){
						
						//add active class to the first item
						$dataItems.eq(0).addClass('autocomplete-active');
					}
					else{	
						if(activeItemIndex + 1 < $dataItems.length){
							$nextItem = $dataItems.eq(activeItemIndex + 1);
							$nextItem.addClass('autocomplete-active');
						}
						else{
							$activeItem.addClass('autocomplete-active');
						}
						
					}
				}
			}
		}
	};
		
	/**
	* close all placeholders
	* @param {Object} context
	*/
	var closeAll = function(context){		
		
		jQuery('[data-control-type="autocomplete"] [data-type="placeholder"]').each(function(){
				
			var $placeholder = jQuery(this);
			
			if($placeholder.data('autocomplete-placeholder') === true){
				$placeholder.hide();
			}
		});
	};
	
	/**
	* show / hide
	* @param {Object} context
	*/
	var setVisibility = function(context){
	
		var jsonLength;		
	
		//get data length
		jsonLength = Number(context.$placeholder.attr('data-length')) || 0;
		
		if(jsonLength > 0){
		
			//show placeholder
			context.$placeholder.show(0);
		}
		else{			
			//close all placeholders
			closeAll(context);
		}		
	};
	
	/** 
	* render control
	* @param {Object} context
	*/
	var render = function(context){
		
		var placeholderHTML = '<div class="jplist-autocomplete-placeholder"><div class="autocomplete-box" data-type="placeholder"></div></div>';
		
		//create actions wrapper
		context.$control.wrapInner('<div data-type="actions" class="jplist-autocomplete-actions"></div>');
		context.$actions = context.$control.find('[data-type="actions"]');
		
		if(context.$input.next('[data-type="placeholder"]').length <= 0){
			
			//add placeholder to the body
			context.$actions.after(placeholderHTML);
			
			//get placeholder
			context.$placeholder = context.$control.find('[data-type="placeholder"]:first');
		}
		
		//save data attribute
		context.$placeholder.data('autocomplete-placeholder', true);
		
		//set hidden content position
		setVisibility(context);
	};
	
	/** 
	* draw html of dropdown
	* @param {Object} context
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>} dataview - collection dataview
	* @param {string} inputValue
	*/
	var drawHTML = function(context, dataview, inputValue){
	
		var html = '';
		
		context.$placeholder.empty();
		
		jQuery.each(dataview, function(index, el){			
			html += el.html;
		});
		
		//set html
		context.$placeholder.html(html);
		
		//set data-length attribute
		context.$placeholder.attr('data-length', dataview.length);
		
		//set hidden content position
		setVisibility(context);	
		
		//remove loading class
		context.$control.removeClass('autocomplete-loading');
		
		//callback
		if(context.params.onSuggest && jQuery.isFunction(jQuery.fn.jplist.settings[context.params.onSuggest])){
			jQuery.fn.jplist.settings[context.params.onSuggest](context, dataview, inputValue);
		}
		
	};
	
	/** 
	* draw html of dropdown
	* @param {Object} context
	* @param {jQuery.fn.jplist.domain.dom.models.DataItemModel} dataitem
	* @param {string} inputValue
	*/
	var drawServerHTML = function(context, dataitem, inputValue){
		
		var html = '';
		
		if(dataitem){
			if(context.params.render && jQuery.isFunction(jQuery.fn.jplist.settings[context.params.render])){
			
				html = jQuery.fn.jplist.settings[context.params.render](dataitem);
			}
			else{
				html = dataitem['content'];
			}
			
			//set html
			context.$placeholder.html(html);	

			//set data-length attribute
			context.$placeholder.attr('data-length', dataitem['count']);
		}
		else{
			//set html
			context.$placeholder.empty();	

			//set data-length attribute
			context.$placeholder.attr('data-length', 0);
		}
		
		//set hidden content position
		setVisibility(context);	
		
		//remove loading class
		context.$control.removeClass('autocomplete-loading');
		
		//callback
		if(context.params.onSuggest && jQuery.isFunction(jQuery.fn.jplist.settings[context.params.onSuggest])){
			jQuery.fn.jplist.settings[context.params.onSuggest](context, dataitem, inputValue);
		}
	};
	
	/**
	* on input field keyup
	* @param {Object} context
	*/
	var initInputKeyupEvent = function(context){
		
		context.$input.on('keyup', function(e){
			
			var val;
			
			e.stopPropagation();
			
			//get value
			val = jQuery.trim(jQuery(this).val());
			
			switch(e.keyCode){
			
				case context.askii.UP:{				
					setUpDown(context, 'up');					
				}
				break;
				
				case context.askii.DOWN:{				
					setUpDown(context, 'down');					
				}
				break;
				
				case context.askii.ENTER:{				
					enter(context);					
				}
				break;
				
				case context.askii.RETURN:{					
					enter(context);					
				}
				break;
				
				default:{
					
					if(val.length >= context.params.minChars || val.length === 0){
						
						//add loading class
						context.$control.addClass('autocomplete-loading');
						
						//trigger get data event
						context.scopeObserver.trigger(context.scopeObserver.events.inputValueChanged, [val]);
					}
				}
			}
		});
	};
		
	/**
	* init events
	* @param {Object} context
	*/
	var initEvents = function(context){
		
		//DOM data loaded
		//@param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>} dataview
		//@param {string} inputValue
		context.scopeObserver.on(context.scopeObserver.events.DOMDataLoaded, function(e, dataview, inputValue){
			drawHTML(context, dataview, inputValue);
		});
		
		//Server Data Loaded
		//@param {jQuery.fn.jplist.domain.dom.models.DataItemModel} dataitem
		//@param {string} inputValue
		context.scopeObserver.on(context.scopeObserver.events.ServerDataLoaded, function(e, dataitem, inputValue){
			drawServerHTML(context, dataitem, inputValue);
		});
		
		/**
		* on key up
		*/
		initInputKeyupEvent(context);
		
		/**
		* on input click -> disable placeholder hiding
		*/
		context.$input.on('click', function(e){
		
			e.stopPropagation();
			
			//close all placeholders
			closeAll(context);
						
			//show placeholder if needed
			setVisibility(context);
		});
		
		/**
		* close on document click
		*/
		jQuery(document).on('click', function(){
			
			//close all placeholders
			closeAll(context);
		});
		
		/**
		* on placeholder click -> disable placeholder hiding
		*/
		context.$placeholder.on('click', function(e){		
			e.stopPropagation();
		});
		
		/**
		* on button click
		*/
		context.$btn.on('click', function(e){
			
			enter(context);
		});
	};
	
	/** 
	* Autocomplete Control
	* @constructor
	* @param {jQueryObject} $control
	* @param {Object} scopeObserver
	* @param {Object} autocompleteParams
	*/
	var Init = function($control, scopeObserver, autocompleteParams){
		
		var context = {
			
			$control: $control
			,scopeObserver: scopeObserver
			
			,$input: $control.find('input[type="text"]')
			,$btn: $control.find('button')	
			,$actions: null
			,$placeholder: null
			,params: autocompleteParams
			
			//ASCII
			,askii: {
				LEFT: 37
				,UP: 38
				,RIGHT: 39
				,DOWN: 40
				,ENTER: 13 
				,RETURN: 3
			}
		};
		
		//empty input field
		context.$input.val('');
		
		//render control html
		render(context);
		
		//init events
		initEvents(context);
		
		return jQuery.extend(this, context);
	};

	/** 
	* Autocomplete View
	* @constructor
	* @param {jQueryObject} $control
	* @param {Object} scopeObserver
	* @param {Object} autocompleteParams
	*/
	jQuery.fn.jplist.ui.controls.AutocompleteView = function($control, scopeObserver, autocompleteParams){
		return new Init($control, scopeObserver, autocompleteParams);
	};	
})();	