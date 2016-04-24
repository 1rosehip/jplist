var jplist = jQuery.fn.jplist;

/**
 * text filter with sort bundle
 */
QUnit.module('Integration Test: Text Filters with Sort Bundle');

QUnit.test('Simple text filter', function(assert){

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
    var observer = new jplist.PubSub($root, options);
    var path = new jplist.PathModel('.title', 'text');

    var dataitems = new jplist.Dataitems(observer, $root.find('.jplist-item'), [path]);

    //create statuses collection -----------------
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

    //apply statuses to the dataitems
    var $dataview = dataitems.applyStatuses(statuses);

    //--------------------------------------------------

    var firstTitle = $dataview.eq(0).find('.title').text();
    var secondTitle = $dataview.eq(1).find('.title').text();
    var length = $dataview.length;

    //check that html structure is valid
    assert.ok((firstTitle === 'bbb') &&
            (secondTitle === 'testbb') &&
            (length === 2), firstTitle + ' ' + secondTitle + ' ' + length);
});

QUnit.test('Filter and after that sort', function(assert){

    var html = '<div id="demo">';

    html += '<div class="list">';
    html += '<div class="jplist-item"><div class="title">aaa</div></div>';
    html += '<div class="jplist-item"><div class="title">bbb</div></div>';
    html += '<div class="jplist-item"><div class="title">ccc</div></div>';
    html += '<div class="jplist-item"><div class="title">testbb</div></div>';
    html += '<div class="jplist-item"><div class="title">aabbb</div></div>';
    html += '</div>';
    html += '</div>';

    var $root = $(html);

    var options = {
        itemsBox: '.list'
        ,itemPath: '.jplist-item'
    };
    var observer = new jplist.PubSub($root, options);
    var path = new jplist.PathModel('.title', 'text');

    var dataitems = new jplist.Dataitems(observer, $root.find('.jplist-item'), [path]);

    //create statuses collection -----------------
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
        },
        {
            "action": "sort",
            "name": "sort",
            "type": "sort-drop-down",
            "data": {
                "order": "desc",
                "ignore": "",
                "path": ".title",
                "type": "text",
                "dateTimeFormat": "{month}/{day}/{year}"
            },
            "inStorage": true,
            "inAnimation": true,
            "isAnimateToTop": false,
            "inDeepLinking": true
        }
    ];

    //apply statuses to the dataitems
    var $dataview = dataitems.applyStatuses(statuses);

    //--------------------------------------------------

    var firstTitle = $dataview.eq(0).find('.title').text();
    var secondTitle = $dataview.eq(1).find('.title').text();
    var thirdTitle = $dataview.eq(2).find('.title').text();
    var length = $dataview.length;

    //check that html structure is valid
    assert.ok((firstTitle === 'testbb') &&
        (secondTitle === 'bbb') &&
        (thirdTitle === 'aabbb') &&
        (length === 3), firstTitle + ' ' + secondTitle + ' ' + thirdTitle + ', length: ' +  length);
});

QUnit.test('Sort and after that filter', function(assert){

    var html = '<div id="demo">';

    html += '<div class="list">';
    html += '<div class="jplist-item"><div class="title">aaa</div></div>';
    html += '<div class="jplist-item"><div class="title">bbb</div></div>';
    html += '<div class="jplist-item"><div class="title">ccc</div></div>';
    html += '<div class="jplist-item"><div class="title">testbb</div></div>';
    html += '<div class="jplist-item"><div class="title">aabbb</div></div>';
    html += '</div>';
    html += '</div>';

    var $root = $(html);

    var options = {
        itemsBox: '.list'
        ,itemPath: '.jplist-item'
    };
    var observer = new jplist.PubSub($root, options);
    var path = new jplist.PathModel('.title', 'text');

    var dataitems = new jplist.Dataitems(observer, $root.find('.jplist-item'), [path]);

    //create statuses collection -----------------
    var statuses = [
        {
            "action": "sort",
            "name": "sort",
            "type": "sort-drop-down",
            "data": {
                "order": "desc",
                "ignore": "",
                "path": ".title",
                "type": "text",
                "dateTimeFormat": "{month}/{day}/{year}"
            },
            "inStorage": true,
            "inAnimation": true,
            "isAnimateToTop": false,
            "inDeepLinking": true
        },
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

    //apply statuses to the dataitems
    var $dataview = dataitems.applyStatuses(statuses);

    //--------------------------------------------------

    var firstTitle = $dataview.eq(0).find('.title').text();
    var secondTitle = $dataview.eq(1).find('.title').text();
    var thirdTitle = $dataview.eq(2).find('.title').text();
    var length = $dataview.length;

    //check that html structure is valid
    assert.ok((firstTitle === 'testbb') &&
        (secondTitle === 'bbb') &&
        (thirdTitle === 'aabbb') &&
        (length === 3), firstTitle + ' ' + secondTitle + ' ' + thirdTitle + ', length: ' +  length);
});


