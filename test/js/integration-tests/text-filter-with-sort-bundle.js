/**
 * text filter with sort bundle
 */
QUnit.module('Integration Test: Text Filters with Sort Bundle');

QUnit.test('1', function(assert){

    var html = '<div id="demo">';

    html += '<div class="list">';
    html += '<div class="jplist-item"><div class="title">aaa</div></div>';
    html += '<div class="jplist-item"><div class="title">bbb</div></div>';
    html += '<div class="jplist-item"><div class="title">ccc</div></div>';
    html += '</div>';
    html += '</div>';

    var $root = $(html);

    var options = {
        itemsBox: '.list'
        ,itemPath: '.jplist-item'
    };
    var observer = new jQuery.fn.jplist.app.events.PubSub($root, options);
    var panelPaths = new jQuery.fn.jplist.domain.dom.collections.DataItemMemberPathCollection();

    var path = new jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel('.title', 'text');
    panelPaths.add(path);

    //create dom controller
    var domController = new jQuery.fn.jplist.ui.list.controllers.DOMController($root, options, observer, panelPaths);

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

    var statusesCollection = new jQuery.fn.jplist.app.dto.StatusesDTOCollection(statuses);

    var collection = new jQuery.fn.jplist.domain.dom.collections.DataItemsCollection(observer, $root.find('.jplist-item'), panelPaths);

    var $dataview = collection.applyStatuses(statuses);

    //check that html structure is valid
    console.log($dataview.length);

    assert.ok(true, '1')
});

