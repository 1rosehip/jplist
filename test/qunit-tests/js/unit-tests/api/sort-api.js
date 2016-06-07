QUnit.module('Unit Test: Sort API');

QUnit.test('sort api function exists - 1', function(assert){

    assert.ok(jQuery.isFunction(jQuery.jplist.sort));
});

QUnit.test('sort api function exists - 2', function(assert){

    assert.ok(jQuery.isFunction($.jplist.sort));
});

QUnit.test('sort api function exists - 1', function(assert){

    var html = '<div data-type="jplist-item"><div class="title">ccc</div></div>\
        <div data-type="jplist-item"><div class="title">bbb</div></div>\
        <div data-type="jplist-item"><div class="title">aaa</div></div>';

    var order = 'asc';
    var type = 'text';
    var path = '.title';
    var ignore = '';
    var dateTimeFormat = '';
    var resultType = 'html';

    var result = jQuery.jplist.sort(html, order, type, path, ignore, dateTimeFormat, resultType);
    console.log(result);
    assert.ok(true);
});
