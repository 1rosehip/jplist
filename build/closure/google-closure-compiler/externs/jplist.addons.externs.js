//PLUGINS AND CONTROLS REGISTRATION ----------------------------
jQuery.fn.jplist.controlTypes = {};
jQuery.fn.jplist.itemControlTypes = {};
jQuery.fn.jplist.settings = {};

//NAMESPACES ---------------------------------------------------

/**
* Path of dataitem member (for example, defined by data-path and data-type attributes within controls)
* @param {?string} jqPath - jquery path
* @param {?string} dataType - data type of the content in this path - text, number, datetime
* @constructor
*/
jQuery.fn.jplist.PathModel = function(jqPath, dataType){}

/**
* data item - item in list that should be sorted, filtered etc.
* @constructor
* @param {jQueryObject} $item - item to add to data array	
* @param {Array.<jQuery.fn.jplist.PathModel>} paths - paths objects array
* @param {number} index
* @class Dataitem - item within jplist container	
*/
jQuery.fn.jplist.DataItemModel = function($item, paths, index){}

jQuery.fn.jplist.FiltersService = jQuery.fn.jplist.FiltersService || {};
jQuery.fn.jplist.FiltersService.textFilter = '';

jQuery.fn.jplist.SortService = jQuery.fn.jplist.SortService || {};
jQuery.fn.jplist.PaginationService = jQuery.fn.jplist.PaginationService || {};

/**
* Infrastructure Layer Namespace
* @type {Object}
* @namespace
*/
jQuery.fn.jplist.URIService = {};

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
jQuery.fn.jplist.StatusDTO = function(name, action, type, data, inStorage, inAnimation, isAnimateToTop, inDeepLinking){};