
/** 
* jplist
* @param {Object} userOptions - jplist user options
*/
jQuery.fn.prototype.jplist = function(userOptions){};

/**
* view namespace
* @type {Object}
* @namespace
*/
jQuery.fn.jplist.prototype.view = {};

/**
* controller namespace
* @type {Object}
* @namespace
*/
jQuery.fn.jplist.prototype.controller = {};

/**
* controls namespace
* @type {Object}
* @namespace
*/
jQuery.fn.jplist.prototype.controls = {};

/**
* actions namespace
* @type {Object}
* @namespace
*/
jQuery.fn.jplist.prototype.actions = {};

/**
* services namespace
* @type {Object}
* @namespace
*/
jQuery.fn.jplist.prototype.services = {};

/**
* models namespace
* @type {Object}
* @namespace
*/
jQuery.fn.jplist.prototype.models = {};

/**
* Addons Namespace
* @type {Object}
* @namespace
*/
jQuery.fn.jplist.addons = {};
	
/**
* Events
* @param {jQueryObject} $jplistBox - jplist jquery element
* @param {Object} options - jplist user options
* @return {Object} - events
* @constructor 
*/
jQuery.fn.jplist.controller.Events = function($jplistBox, options){};
	
/**
* panel control 
* @param {jQueryObject} $jplistBox - jplist jquery element
* @param {Object} options - jplist options
* @param {jQueryObject} $control
* @constructor 
*/
jQuery.fn.jplist.view.PanelControl = function($jplistBox, options, $control){};

/**
* @type {jQueryObject}
*/
jQuery.fn.jplist.view.PanelControl.prototype.$control;

/**
* @type {jQueryObject}
*/
jQuery.fn.jplist.view.PanelControl.prototype.$jplistBox;

/**
* @type {Object}
*/
jQuery.fn.jplist.view.PanelControl.prototype.options;

/**
* @type {jQuery.fn.jplist.controller.Events}
*/
jQuery.fn.jplist.view.PanelControl.prototype.events;

/**
* @type {string}
*/
jQuery.fn.jplist.view.PanelControl.prototype.name;

/**
* @type {string}
*/
jQuery.fn.jplist.view.PanelControl.prototype.action;

/**
* @type {string}
*/
jQuery.fn.jplist.view.PanelControl.prototype.type;

/**
* @type {boolean}
*/
jQuery.fn.jplist.view.PanelControl.prototype.cookies;

/**
* @type {string}
*/
jQuery.fn.jplist.view.PanelControl.prototype.category;

/**
* @type {Object}
*/
jQuery.fn.jplist.view.PanelControl.options;

/**
* @type {string}
*/
jQuery.fn.jplist.view.PanelControl.options.prototype.status_event;

/**
* @type {string}
*/
jQuery.fn.jplist.view.PanelControl.options.prototype.force_ask_event;

/**
* Status
* @param {?string} name
* @param {?string} action
* @param {?string} type
* @param {Object} data
* @param {boolean} cookies
* @param {string} category - control category
* @constructor 
*/
jQuery.fn.jplist.models.Status = function(name, action, type, data, cookies, category){};

/**
* @type {Object}
*/
jQuery.fn.jplist.models.Status.prototype.data;

/**
* path inside dataitem: defined by data-path and data-type attributes within controls
* @param {?string|Object|null} jqPath - jquery path
* @param {?string} dataType - data type of the content in this path - text, number, datetime
* @constructor 
*/
jQuery.fn.jplist.models.Path = function(jqPath, dataType){};

/** 
* Path Service
* @type {Object} 
* @class Services for the path object (path inside dataitem, defined by data-path and data-type attributes within controls)
* @memberOf jQuery.fn.jplist.services
*/
jQuery.fn.jplist.services.Path = {};	
	
/**
* Is given path is in the given paths list (compare by jquery path only, data type is ignored)
* @param {jQuery.fn.jplist.models.Path} path
* @param {Array.<jQuery.fn.jplist.models.Path>} pathsList
* @return {boolean}
* @memberOf jQuery.fn.jplist.services.Path
*/
jQuery.fn.jplist.services.Path.isPathInList = function(path, pathsList){};


//PLUGINS AND CONTROLS REGISTRATION ----------------------------
jQuery.fn.jplist.controlTypes;
jQuery.fn.jplist.itemControlTypes;

//NAMESPACES ---------------------------------------------------

/**
* Application Layer Namespace
*/
jQuery.fn.jplist.app;
jQuery.fn.jplist.app.services;
jQuery.fn.jplist.app.services.DTOMapperService;
jQuery.fn.jplist.app.dto;
/**
* Domain Layer Namespace
* @type {Object}
* @namespace
*/
jQuery.fn.jplist.domain;

jQuery.fn.jplist.domain.dom;
jQuery.fn.jplist.domain.dom.models;
jQuery.fn.jplist.domain.dom.collections;
jQuery.fn.jplist.domain.dom.services;
jQuery.fn.jplist.domain.dom.services.FiltersService;
jQuery.fn.jplist.domain.dom.services.SortService;
jQuery.fn.jplist.domain.dom.services.pagination;

jQuery.fn.jplist.domain.server;
jQuery.fn.jplist.domain.server.models;

/**
* Infrastructure Layer Namespace
* @type {Object}
* @namespace
*/
jQuery.fn.jplist.dal;
jQuery.fn.jplist.dal.services;

/**
* Presentation Layer Namespace
* @type {Object}
* @namespace
*/
jQuery.fn.jplist.ui;	
jQuery.fn.jplist.ui.list;
jQuery.fn.jplist.ui.list.models;
jQuery.fn.jplist.ui.list.controllers;
jQuery.fn.jplist.ui.list.collections;
jQuery.fn.jplist.ui.list.views;	
jQuery.fn.jplist.ui.controls;
jQuery.fn.jplist.ui.itemControls;
jQuery.fn.jplist.ui.statuses;
jQuery.fn.jplist.ui.panel;
jQuery.fn.jplist.ui.panel.controllers;
jQuery.fn.jplist.ui.panel.collections;

Object.prototype.observer;	
Object.observer.events.prototype.setStatusesEvent;
Object.observer.events.prototype.renderStatusesEvent;
Object.observer.events.prototype.forceRenderStatusesEvent;
var context;
context.prototype.history;
context.history.prototype.popStatus = function(){};
context.history.prototype.popList = function(){};
context.history.prototype.getLastStatus = function(){};
context.history.prototype.getLastList = function(){};