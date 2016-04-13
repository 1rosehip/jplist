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
jQuery.fn.jplist.domain.dom.collections = jQuery.fn.jplist.domain.dom.collections || {};
jQuery.fn.jplist.domain.dom.services = jQuery.fn.jplist.domain.dom.services || {};
jQuery.fn.jplist.domain.dom.services.FiltersService = jQuery.fn.jplist.domain.dom.services.FiltersService || {};
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
		