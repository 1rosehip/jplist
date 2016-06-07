;(function(){
    'use strict';

    /**
     * check if sort api parameters are valid
     * @param {jQueryObject} $items - html or jQuery items collection to sort
     * @param {string} order - asc or desc
     * @param {string} type - 'text', 'number' or 'datetime'
     * @return {boolean}
     */
    var isValid = function($items, order, type){

        //TODO: $items should not be empty ?

        return (order === 'asc' || order === 'desc') &&
            (type === 'text' || type === 'number' || type === 'datetime');
    };

    /**
     * init dataitems
     * @param {jQueryObject} $items - html or jQuery items collection to sort
     * @param {string} type - 'text', 'number' or 'datetime'
     * @param {string=} path - jquery path inside html (optional)
     * @return {jQuery.fn.jplist.Dataitems}
     */
    var initDataItems = function($items, type, path){

        var dataitems
            ,observer
            ,paths;

        //init paths: text, number, datetime
        paths = [new jQuery.fn.jplist.PathModel(path, type)];

        observer = new jQuery.fn.jplist.PubSub(jQuery('<div></div>'), {});

        return new jQuery.fn.jplist.Dataitems(observer, $items, paths);
    };

    /**
     * init sort status
     * @param {string} order - asc or desc
     * @param {string} type - 'text', 'number' or 'datetime'
     * @param {string=} path - jquery path inside html (optional)
     * @param {string=} ignore - regex expression that defines characters that should be ignored (optional)
     * @param {string=} dateTimeFormat (optional); The following wilcards could be used: {year}, {month}, {day}, {hour}, {min}, {sec}.
     * @return {Object}
     */
    var initSortStatus = function(order, type, path, ignore, dateTimeFormat){

        var status = {
            'action': 'sort'
            ,'name': 'sort'
            ,'type': 'sort'
            ,'data': {
                'path': path
                ,'type': type
                ,'order': order
                ,'dateTimeFormat': dateTimeFormat
                ,'ignore': ignore
            }
            ,'inStorage': false
            ,'inAnimation': false
            ,'isAnimateToTop': false
            ,'inDeepLinking': false
        };

        return status;
    };

    /**
     * sort
     * @param {jQueryObject} $items - html or jQuery items collection to sort
     * @param {string} order - asc or desc
     * @param {string} type - 'text', 'number' or 'datetime'
     * @param {string=} path - jquery path inside html (optional)
     * @param {string=} ignore - regex expression that defines characters that should be ignored (optional)
     * @param {string=} dateTimeFormat (optional); The following wilcards could be used: {year}, {month}, {day}, {hour}, {min}, {sec}.
     * @param {string=} resultType (optional) - 'html' or 'jquery'. The default is 'jquery'.
     * @return {jQueryObject|string} - sorted jQuery items
     */
    jQuery.jplist.sort = function($items, order, type, path, ignore, dateTimeFormat, resultType){

        var dataitems
            ,status;

        //validation
        if(!isValid($items, order, type)){

            //TODO: throw error
            console.log('valdation error');
        }

        //init statuses
        //TODO: path is optional ???
        status = initSortStatus(order, type, path, ignore, dateTimeFormat);

        //init dataitems
        //TODO: path is optional ???
        dataitems = initDataItems($items, type, path);

        //start the sorting
        dataitems.sort([status]);

        if(resultType === 'html'){

            return dataitems.dataviewToString();
        }
        else{
            return dataitems.dataviewToJqueryObject();
        }
    };

})();
