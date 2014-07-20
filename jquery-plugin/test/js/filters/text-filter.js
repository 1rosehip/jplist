/**
* text filters
*/
QUnit.module('Text Filters');

/**
* 3 items, search 'a' in title
*/
QUnit.test('Seach "a" in title, 3 items in array', function(assert){

	var resultDataview = helper3ItemsArray('.title', 'a', null);
	
	assert.ok(resultDataview.length == 1, 'Array should have 1 item')
});

/**
* Search "" in title, 3 items in array
*/
QUnit.test('Search "" in title, 3 items in array', function(assert){
	
	var resultDataview = helper3ItemsArray('.title', '', null);
	
	assert.ok(resultDataview.length == 3, 'All results should  be returned')
});

/**
* Search null in title, 3 items in array
*/
QUnit.test('Search null in title, 3 items in array', function(assert){
	
	var resultDataview = helper3ItemsArray('.title', null, null);
	
	assert.ok(resultDataview.length == 3, 'All results should  be returned')
});

/**
* Search "   " in title, 3 items in array with regex [ ]+
*/
QUnit.test('Search "   " in title, 3 items in array with regex [ ]+', function(assert){
	
	var resultDataview = helper3ItemsArray('.title', '    ', '[ ]+');
	
	assert.ok(resultDataview.length == 3, 'All results should  be returned')
});

/**
* Search undefined in title, 3 items in array
*/
QUnit.test('Search undefined in title, 3 items in array', function(assert){
	
	var resultDataview = helper3ItemsArray('.title', undefined, null);
	
	assert.ok(resultDataview.length == 3, 'All results should  be returned')
});

/**
* Search non english letters in title, 3 items in array
*/
QUnit.test('Search non english letters in title, 3 items in array', function(assert){
	
	var dataview = []
		,paths = []
		,resultDataview;
	
	//init paths: text, number, datetime
	paths.push(new jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel('.title', 'text'));
	
	//init data items
	dataview.push(new jQuery.fn.jplist.domain.dom.models.DataItemModel($('<div data-type="jplist-item"><div class="title">ребенок</div></div>'), paths, 0));
	dataview.push(new jQuery.fn.jplist.domain.dom.models.DataItemModel($('<div data-type="jplist-item"><div class="title">собака</div></div>'), paths, 1));
	dataview.push(new jQuery.fn.jplist.domain.dom.models.DataItemModel($('<div data-type="jplist-item"><div class="title">кошка</div></div>'), paths, 2));
	
	//text filter
	resultDataview = jQuery.fn.jplist.domain.dom.services.FiltersService.textFilter(
		'ко'
		,new jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel('.title', 'text') //path object
		,dataview
		,''
	);
	
	assert.ok(resultDataview.length == 1, '1 item should  be returned')
});

/**
* Search text with special characters
*/
QUnit.test('Search text with special characters, 3 items in array, "[~!@#$%^&*()+=`\'"\/\\_ ]+"', function(assert){
	
	var resultDataview = helper3ItemsArray('.title', 'a!@^', '[~!@#$%^&*()+=`\'"\/\\_ ]+');
	
	assert.ok(resultDataview.length == 1, '1 item should  be returned')
});

//-----------------------------------------------------------------------------------------------------------------------

/**
* Helper: 3 items array
* @param {string} jqueryPath - jquery path
* @param {string} searchText - search text
* @param {string} ignoreRegex - ignore regex
*/
var helper3ItemsArray = function(jqueryPath, searchText, ignoreRegex){

	var dataview = []
		,paths = []
		,resultDataview;
	
	//init paths: text, number, datetime
	paths.push(new jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel(jqueryPath, 'text'));
	
	//init data items
	dataview.push(new jQuery.fn.jplist.domain.dom.models.DataItemModel($('<div data-type="jplist-item"><div class="title">aaa</div></div>'), paths, 0));
	dataview.push(new jQuery.fn.jplist.domain.dom.models.DataItemModel($('<div data-type="jplist-item"><div class="title">bbb</div></div>'), paths, 1));
	dataview.push(new jQuery.fn.jplist.domain.dom.models.DataItemModel($('<div data-type="jplist-item"><div class="title">ccc</div></div>'), paths, 2));
	
	//text filter
	resultDataview = jQuery.fn.jplist.domain.dom.services.FiltersService.textFilter(
		searchText
		,new jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel(jqueryPath, 'text') //path object
		,dataview
		,ignoreRegex
	);
	
	return resultDataview;
};