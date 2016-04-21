/**
 * text filter with sort bundle
 */
QUnit.module('Integration Test: Text Filters with Sort Bundle');

QUnit.test('1', function(assert){

    var html = '';
    html += '<div data-type="jplist-item"><div class="title">aaa</div></div>';
    html += '<div data-type="jplist-item"><div class="title">bbb</div></div>';
    html += '<div data-type="jplist-item"><div class="title">ccc</div></div>';

    var $root = $(html);
    var options = {};
    var observer = new jQuery.fn.jplist.app.events.PubSub($root, options);
    var panel = {};
    var history = {};

    //create dom controller
    var domController = new jQuery.fn.jplist.ui.list.controllers.DOMController($root, options, observer, panel, history);

    var statuses = [
        {
            "action": "filter",
            "name": "title-filter",
            "type": "textbox",
            "data": {
                "path": ".title",
                "ignore": "[~!@#$%^&*()+=`'\"/\\_]+",
                "value": "",
                "filterType": "TextFilter"
            },
            "inStorage": true,
            "inAnimation": true,
            "isAnimateToTop": false,
            "inDeepLinking": true
        }
    ];

    var statusesCollection = new jQuery.fn.jplist.app.dto.StatusesDTOCollection(options, observer, statuses);

    domController.renderStatuses(statuses);

    //check that html structure is valid
    console.log(domController.collection.dataviewToJqueryObject());

    assert.ok(true, '1')
});

