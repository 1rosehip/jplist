//PLUGINS AND CONTROLS REGISTRATION ----------------------------
jQuery.fn.jplist.controlTypes = {};
jQuery.fn.jplist.itemControlTypes = {};
jQuery.fn.jplist.settings = {};

//NAMESPACES ---------------------------------------------------

/**
* Application Layer Namespace
*/
jQuery.fn.jplist.app = jQuery.fn.jplist.app || {};
jQuery.fn.jplist.app.services = jQuery.fn.jplist.app.services || {};
jQuery.fn.jplist.app.services.DTOMapperService = jQuery.fn.jplist.app.services.DTOMapperService || {};
jQuery.fn.jplist.app.dto = jQuery.fn.jplist.app.dto || {};
jQuery.fn.jplist.app.events = jQuery.fn.jplist.app.events || {};

/**
* Domain Layer Namespace
* @type {Object}
* @namespace
*/
jQuery.fn.jplist.domain = jQuery.fn.jplist.domain || {};

jQuery.fn.jplist.domain.dom = jQuery.fn.jplist.domain.dom || {};
jQuery.fn.jplist.domain.dom.models = jQuery.fn.jplist.domain.dom.models || {};

/**
* Path of dataitem member (for example, defined by data-path and data-type attributes within controls)
* @param {?string} jqPath - jquery path
* @param {?string} dataType - data type of the content in this path - text, number, datetime
* @constructor
*/
jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel = function(jqPath, dataType){}	

/**
* data item - item in list that should be sorted, filtered etc.
* @constructor
* @param {jQueryObject} $item - item to add to data array	
* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel>} paths - paths objects array
* @param {number} index
* @class Dataitem - item within jplist container	
*/
jQuery.fn.jplist.domain.dom.models.DataItemModel = function($item, paths, index){}

jQuery.fn.jplist.domain.dom.collections = jQuery.fn.jplist.domain.dom.collections || {};
jQuery.fn.jplist.domain.dom.services = jQuery.fn.jplist.domain.dom.services || {};

jQuery.fn.jplist.domain.dom.services.FiltersService = jQuery.fn.jplist.domain.dom.services.FiltersService || {};
jQuery.fn.jplist.domain.dom.services.FiltersService.textFilter = '';	

jQuery.fn.jplist.domain.dom.services.SortService = jQuery.fn.jplist.domain.dom.services.SortService || {};
jQuery.fn.jplist.domain.dom.services.pagination = jQuery.fn.jplist.domain.dom.services.pagination || {};

jQuery.fn.jplist.domain.server = jQuery.fn.jplist.domain.server || {};
jQuery.fn.jplist.domain.server.models = jQuery.fn.jplist.domain.server.models || {};

jQuery.fn.jplist.domain.deeplinks = jQuery.fn.jplist.domain.deeplinks || {};
jQuery.fn.jplist.domain.deeplinks.services = jQuery.fn.jplist.domain.deeplinks.services || {};

/**
* Infrastructure Layer Namespace
* @type {Object}
* @namespace
*/
jQuery.fn.jplist.dal = jQuery.fn.jplist.dal || {};
jQuery.fn.jplist.dal.services = jQuery.fn.jplist.dal.services || {};
jQuery.fn.jplist.dal.services.URIService = {};

/**
* Presentation Layer Namespace
* @type {Object}
* @namespace
*/
jQuery.fn.jplist.ui = jQuery.fn.jplist.ui || {};	
jQuery.fn.jplist.ui.list = jQuery.fn.jplist.ui.list || {};
jQuery.fn.jplist.ui.list.models = jQuery.fn.jplist.ui.list.models || {};
jQuery.fn.jplist.ui.list.controllers = jQuery.fn.jplist.ui.list.controllers || {};
jQuery.fn.jplist.ui.list.collections = jQuery.fn.jplist.ui.list.collections || {};
jQuery.fn.jplist.ui.list.views = jQuery.fn.jplist.ui.list.views || {};	
jQuery.fn.jplist.ui.controls = jQuery.fn.jplist.ui.controls || {};
jQuery.fn.jplist.ui.itemControls = jQuery.fn.jplist.ui.itemControls || {};
jQuery.fn.jplist.ui.statuses = jQuery.fn.jplist.ui.statuses || {};
jQuery.fn.jplist.ui.panel = jQuery.fn.jplist.ui.panel || {};
jQuery.fn.jplist.ui.panel.controllers = jQuery.fn.jplist.ui.panel.controllers || {};
jQuery.fn.jplist.ui.panel.collections = jQuery.fn.jplist.ui.panel.collections || {};

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
jQuery.fn.jplist.app.dto.StatusDTO = function(name, action, type, data, inStorage, inAnimation, isAnimateToTop, inDeepLinking){};