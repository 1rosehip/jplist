(function(){
    'use strict';

    /**
     * Radio Buttons Text Filter DTO
     * @constructor
     * @param {string} dataPath - textbox data-path attribute
     * @param {string} value - textbox value
     * @param {string} ignore - ignore characters regex (defined in javascript in control's options)
     * @param {boolean} selected
     * @param {string} mode: startsWith, endsWith, contains, advanced
     * @param {string} not - not operators in advanced mode
     * @param {string} and - and operators in advanced mode
     * @param {string} or - or operators in advanced mode
     */
    jQuery.fn.jplist.controls.RadioButtonsTextFilterDTO = function(dataPath, value, selected, ignore, mode, not, and, or){

        return {
            path: dataPath
            ,ignore: ignore
            ,value: value
            ,selected: selected
            ,mode: mode
            ,not: not
            ,and: and
            ,or: or
            ,filterType: 'TextFilter'
        };
    };

})();

