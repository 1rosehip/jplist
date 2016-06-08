QUnit.module('Unit Test: Sort API');

QUnit.test('sort api function exists - 1', function(assert){

    assert.ok(jQuery.isFunction(jQuery.jplist.sort));
});

QUnit.test('sort api function exists - 2', function(assert){

    assert.ok(jQuery.isFunction($.jplist.sort));
});

QUnit.test('sort by text', function(assert){

    var html = '<div class="jplist-item"><div class="title">ccc</div></div>\
        <div class="jplist-item"><div class="title">bbb</div></div>\
        <div class="jplist-item"><div class="title">aaa</div></div>';

    var $items = $(html).filter('.jplist-item');

    var order = 'asc';
    var type = 'text';
    var path = '.title';
    var ignore = '';
    var dateTimeFormat = '';
    var resultType = 'html';

    var result = jQuery.jplist.sort($items, order, type, path, ignore, dateTimeFormat, resultType);

    assert.ok(result === '<div class="jplist-item"><div class="title">aaa</div></div><div class="jplist-item"><div class="title">bbb</div></div><div class="jplist-item"><div class="title">ccc</div></div>');
});

QUnit.test('sort by text with the empty path', function(assert){

    var html = '<div class="jplist-item">ccc</div>\
        <div class="jplist-item">bbb</div>\
        <div class="jplist-item">aaa</div>';

    var $items = $(html).filter('.jplist-item');

    var order = 'asc';
    var type = 'text';
    var path = '';
    var ignore = '';
    var dateTimeFormat = '';
    var resultType = 'html';

    var result = jQuery.jplist.sort($items, order, type, path, ignore, dateTimeFormat, resultType);
    console.log(result);
    assert.ok(result === '<div class="jplist-item">aaa</div><div class="jplist-item">bbb</div><div class="jplist-item">ccc</div>');
});
