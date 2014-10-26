(function(){
	'use strict';		
			
	/**
	* Status
	* @constructor 
	* @param {?string} name
	* @param {?string} action
	* @param {?string} type
	* @param {Object} data
	* @param {boolean} inStorage - is stored in storage (cookies, localstorage, etc.)
	* @param {boolean} inAnimation - is included in animations
	* @param {boolean} isAnimateToTop - is "animate to top" enabled
	* @param {boolean} inDeepLinking - is deep linking enabled for the given control
	*/
	jQuery.fn.jplist.app.dto.StatusDTO = function(name, action, type, data, inStorage, inAnimation, isAnimateToTop, inDeepLinking){
			
		this.action = action; //filter, sort, paging			
		this.name = name;
		this.type = type; //drop-down, pagination, textbox
		this.data = data; //related data
		this.inStorage = inStorage;
		this.inAnimation = inAnimation;
		this.isAnimateToTop = isAnimateToTop;
		this.inDeepLinking = inDeepLinking;
	};
})();

