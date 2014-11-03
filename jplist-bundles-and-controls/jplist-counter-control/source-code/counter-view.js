(function(){
	'use strict';		
	
	/**
     * redraw counter value
     * @param {Object} context
     * @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>} dataview
     */
    var drawCounter = function(context, dataview){

        var $countValue
            ,path
			,dataText
			,dataType
            ,list = null
			,ignore = '';

        //get path object from data
        path = /** @type {jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel|null} */ (context.$control.data('path')); 
		dataType = context.$control.data('dataType');
		dataText = /** @type {string} */ (context.$control.data('dataText'));	
		$countValue = context.$control.data('$countValue');
		
		switch(dataType){
			
			case 'path':{
				
				//get dataview
				list = jQuery.fn.jplist.domain.dom.services.FiltersService.pathFilter(
					path
					,dataview
				);
			}
			break;
			
			case 'text':{
				
				if(context.controlOptions && context.controlOptions.ignore){
				 
					//get ignore characters
					ignore = context.controlOptions.ignore;
				}
				
				//get dataview
				list = jQuery.fn.jplist.domain.dom.services.FiltersService.textFilter(
					dataText
					,path
					,dataview
					,ignore
				);
			}
			break;
			
			case 'range':{
		
				//get dataview
				list = jQuery.fn.jplist.domain.dom.services.FiltersService.rangeFilter(
					path
					,dataview
					,0
					,0
					,Number(context.$control.data('dataMin'))
					,Number(context.$control.data('dataMax'))
				);
			}
			break;
		}
		
		if(list){
			//update value
			$countValue.html(list.length);

			//update class
			if(list.length === 0){
				context.$control.addClass('count-0');
			}
			else{
				context.$control.removeClass('count-0');
			}
		}
    };
	
	/**
	* Render control html
	* @param {Object} context
	*/
	var render = function(context){
		
		 var dataFormat
            ,dataPath
			,dataText
			,dataMode
			,dataType
			,dataMin
			,dataMax
            ,path
            ,html
            ,$countValue;

        //get format
        dataFormat = context.$control.attr('data-format');		
		dataMode = context.$control.attr('data-mode') || 'static';
		
		dataType = context.$control.attr('data-type') || 'path';
        dataPath = context.$control.attr('data-path');
		dataText = context.$control.attr('data-text');
		dataMin = Number(context.$control.attr('data-min'));
		dataMax = Number(context.$control.attr('data-max'));
		
        //init text format
        if(dataFormat){

            //get parsed html
            html = dataFormat.replace('{count}', '<span data-type="count-value"></span>');

            //print html
            context.$control.html(html);

            //get element
            $countValue = context.$control.find('[data-type="count-value"]');

            //save it in data
            context.$control.data('$countValue', $countValue);
        }

        if(dataPath){

            //get path
            path = new jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel(dataPath, null);     
			context.$control.data('path', path);			
        }
		
		//save data			
		context.$control.data('dataMode', dataMode);
		context.$control.data('dataType', dataType);
		
		context.$control.data('dataPath', dataPath);
		context.$control.data('dataText', dataText);
		
		context.$control.data('dataMin', dataMin);
		context.$control.data('dataMax', dataMax);
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

        //init vars
        jqPath = context.$control.attr('data-path');
        dataType = context.$control.attr('data-type');

        //init path
        if(jqPath){

            //init path
            path = new jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel(jqPath, dataType);
            paths.push(path);
        }
	};
		
	/**
	* Init control events
	* @param {Object} context
	*/
	var initEvents = function(context){	
	
		var dataMode = context.$control.data('dataMode');
		
		switch(dataMode){
			
			/**
			* init count on page load once - if data-mode="static"
			*/
			case 'static':{	
			
				/**
				 * on add collection item event
				 * @param {Object} e - event object
				 * @param {jQuery.fn.jplist.domain.dom.collections.DataItemsCollection} collection
				 */
				context.observer.on(context.observer.events.collectionReadyEvent, function(e, collection){
					
					drawCounter(context, collection.dataitems);
				});
			}
			break;
			
			/**
			* refresh count on every filter action - if data-mode="filter"
			*/
			case 'filter':{			
								
				/**
				 * on filter event
				 * @param {Object} e - event object
				 * @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
				 * @param {jQuery.fn.jplist.domain.dom.collections.DataItemsCollection} collection
				 */
				context.observer.on(context.observer.events.listFiltered, function(e, statuses, collection){	
					drawCounter(context, collection.dataview);
				});
			}
			break;
			
			/**
			* refresh count on every jplist action - if data-mode="all"
			*/
			case 'all':{
			
				/**
				 * bind answer event
				 * @param {Object} e - event object
				 * @param {Array.<jQuery.fn.jplist.app.dto.StatusDTO>} statuses
				 * @param {jQuery.fn.jplist.domain.dom.collections.DataItemsCollection} collection
				 */
				context.observer.on(context.observer.events.setStatusesEvent, function(e, statuses, collection){
					drawCounter(context, collection.dataview);
				});
			}
			break;
		}
		
		/**
		* render counters on items added to the collection (useful in case when counter is the only control on panel)
		* added on 14.10.2014
		*/
		context.observer.on(context.observer.events.dataItemAdded, function(e, dataItem, dataitems){
			drawCounter(context, dataitems);
		});
		
		/**
		* render counters on items deleted to the collection (useful in case when counter is the only control on panel)
		* added on 14.10.2014
		*/
		context.observer.on(context.observer.events.dataItemRemoved, function(e, $item, dataitems){
			drawCounter(context, dataitems);
		});
	};
	
	/** 
	* Dropdown control: sort dropdown, filter dropdown, paging dropdown etc.
	* @constructor
	* @param {Object} context
	*/
	var Init = function(context){
				
		//render control
		render(context);
		
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
	Counter control - used to print a number of items with the given jQuery path
	* @constructor
	* @param {Object} context
	*/
	jQuery.fn.jplist.ui.controls.Counter = function(context){
		return new Init(context);
	};	
	
	/**
	* static control registration
	*/
	jQuery.fn.jplist.controlTypes['counter'] = {
		className: 'Counter'
		,options: {
			ignore: '[~!@#$%^&*()+=`\'"\/\\_]+' //[^a-zA-Z0-9]+ not letters/numbers: [~!@#$%^&*\(\)+=`\'"\/\\_]+
		}
	};			
})();

