(function(){
	'use strict';		
	
	/** 
	 * Textbox Model
	 * @constructor
	 * @param {string} dataPath - textbox data-path attribute
	 * @param {string} value - textbox value
	 * @param {string} ignore - ignore characters regex (defined in javascript in control's options)
	 * @param {string} mode: startsWith, endsWith, contains, advanced
     * @param {Array.<string>|string} not - not operators in advanced mode
     * @param {Array.<string>|string} and - and operators in advanced mode
     * @param {Array.<string>|string} or - or operators in advanced mode
	 */
	jQuery.fn.jplist.controls.TextboxDTO = function(dataPath, value, ignore, mode, not, and, or){
		
		return {
			path: dataPath
			,ignore: ignore
			,value: value
			,mode: mode
            ,not: not
            ,and: and
            ,or: or
			,filterType: 'TextFilter'
		};
	};	
		
})();

