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
    html += '<div class="jplist-item"><div class="title">testbb</div></div>';
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

    var statuses = [
        {
            "action": "filter",
            "name": "title-filter",
            "type": "textbox",
            "data": {
                "path": ".title",
                "ignore": "[~!@#$%^&*()+=`'\"/\\_]+",
                "value": "bb",
                "filterType": "TextFilter"
            },
            "inStorage": true,
            "inAnimation": true,
            "isAnimateToTop": false,
            "inDeepLinking": true
        }
    ];

    var statusesCollection = new jQuery.fn.jplist.app.dto.StatusesDTOCollection(statuses);

    var collection = new jQuery.fn.jplist.domain.dom.collections.DataItemsCollection(observer, $root.find('.jplist-item'), [path]);

    var $dataview = collection.applyStatuses(statuses);

    var firstTitle = $dataview.eq(0).find('.title').text();
    var secondTitle = $dataview.eq(1).find('.title').text();
    var length = $dataview.length;

    //check that html structure is valid
    assert.ok((firstTitle === 'bbb') &&
            (secondTitle === 'testbb') &&
            (length === 2), firstTitle + ' ' + secondTitle + ' ' + length);
});

