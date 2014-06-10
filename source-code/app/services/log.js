/**
* @license jPList - jQuery Data Grid Controls ##VERSION## - http://jplist.com 
* Copyright 2014 Miriam Zusin. All rights reserved.
* For non-commercial, personal, or open source projects and applications, you may use jPList for free under the terms of the GPL V3 License (https://gnu.org/licenses/gpl.html)
* If your project generates any type of income, e.g. sells products, ads, services or just represents a commercial company, you should get a commercial license at http://www.binpress.com
*/
(function(){
	'use strict';		
	
	/**
	* is log enabled
	* @param {Object} options - user options
	*/
	jQuery.fn.jplist.logEnabled = function(options){
		return options.debug && window.console && jQuery.isFunction(window.console.log);
	};
	
	/** 
	* log
	* @param {Object} options - user options
	* @param {string} msg
	* @param {*} item - item to log
	*/
	jQuery.fn.jplist.log = function(options, msg, item){
		
		if(jQuery.fn.jplist.logEnabled(options)){
			window.console.log(msg, item);
		}
	};
	
	/** 
	* info
	* @param {Object} options - user options
	* @param {string} msg
	* @param {*} item - item to log
	*/
	jQuery.fn.jplist.info = function(options, msg, item){
		
		if(jQuery.fn.jplist.logEnabled(options)){
			window.console.info(msg, item);
		}
	};
	
	/** 
	* error
	* @param {Object} options - user options
	* @param {string} msg
	* @param {*} item - item to log
	*/
	jQuery.fn.jplist.error = function(options, msg, item){
		
		if(jQuery.fn.jplist.logEnabled(options)){
			window.console.error(msg, item);
		}
	};
	
	/** 
	* warn
	* @param {Object} options - user options
	* @param {string} msg
	* @param {*} item - item to log
	*/
	jQuery.fn.jplist.warn = function(options, msg, item){
		
		if(jQuery.fn.jplist.logEnabled(options)){
			window.console.warn(msg, item);
		}
	};
	
})();

