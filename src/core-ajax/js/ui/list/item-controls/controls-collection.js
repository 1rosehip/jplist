(function() {
	'use strict';		
	
	/**
	 * add item control to the collection
	 * @param {Object} context
	 * @param {jQueryObject} $itemControl
	 */
	var add = function(context, $itemControl){
		
		var control = context.controlFactory.create($itemControl);
		
		if(control){
			
			//add to the list
			context.controls.push(control);
		}
	};

    /**
     * add all item controls found in the given jquery element (box)
     * @param {Object} context
     * @param {jQueryObject} $controlsBox
     */
    var findAndAdd = function(context, $controlsBox){

        if($controlsBox && $controlsBox.length > 0){

            $controlsBox.find('[data-control-type]').each(function(){

                //add control to the list
                add(context, jQuery(this));
            });
        }
    };

	/**
	 * get panel controls
	 * @param {Object} context
	 */
	var initControls = function(context){

		if(context.options && context.options.itemsBox){

            findAndAdd(context, context.$root.find(context.options.itemsBox));
		}
	};
			
	/** 
	 * Item Control Collection
     * Item controls are controls that appears inside data items in the list and not in the controls panels (like star rating control)
	 * @constructor
	 * @param {Object} options - jplist user options
	 * @param {Object} observer
	 * @param {jQuery.fn.jplist.History} history
	 * @param {jQueryObject} $root
	 * @return {Object}
	 */
	jQuery.fn.jplist.ItemControlCollection = function(options, observer, history, $root){
	
		this.options = options;
		this.observer = observer;
		this.history = history;
		this.$root = $root;
		this.controls = [];
				
		//ini control factory
		this.controlFactory = new jQuery.fn.jplist.ItemControlFactory(options, observer, history, $root);

		//init controls
		initControls(this);
	};
	
})();