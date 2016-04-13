
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

//-----------------------------------------------------------------------------------------------------------------------

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
* text filters: advanced seach
*/
QUnit.module('Text Filters: Advanced Search');

QUnit.test('abc eee - not fff -> true', function(assert){
	var contains = jQuery.fn.jplist.domain.dom.services.FiltersService.advancedSearchParse('abc eee', 'not fff');	
	assert.ok(contains === true, 'true');
});

QUnit.test('abc eee - not abc -> false', function(assert){
	var contains = jQuery.fn.jplist.domain.dom.services.FiltersService.advancedSearchParse('abc eee', 'not abc');	
	assert.ok(contains === false, 'false');
});

QUnit.test('abc eee - abc and eee -> true', function(assert){
	var contains = jQuery.fn.jplist.domain.dom.services.FiltersService.advancedSearchParse('abc eee', 'abc and eee');	
	assert.ok(contains === true, 'true');
});

QUnit.test('abc eee ddd - abc and eee -> true', function(assert){
	var contains = jQuery.fn.jplist.domain.dom.services.FiltersService.advancedSearchParse('abc eee ddd', 'abc and eee');	
	assert.ok(contains === true, 'true');
});

QUnit.test('abc eee ddd - abc and fff -> false', function(assert){
	var contains = jQuery.fn.jplist.domain.dom.services.FiltersService.advancedSearchParse('abc eee ddd', 'abc and fff');	
	assert.ok(contains === false, 'false');
});

QUnit.test('abc eee ddd - abc or fff -> true', function(assert){
	var contains = jQuery.fn.jplist.domain.dom.services.FiltersService.advancedSearchParse('abc eee ddd', 'abc or fff');	
	assert.ok(contains === true, 'true');
});

QUnit.test('abc eee ddd - aaa or fff -> false', function(assert){
	var contains = jQuery.fn.jplist.domain.dom.services.FiltersService.advancedSearchParse('abc eee ddd', 'aaa or fff');	
	assert.ok(contains === false, 'false');
});

QUnit.test('... - aaa or calendar and system -> true', function(assert){
	var contains = jQuery.fn.jplist.domain.dom.services.FiltersService.advancedSearchParse('A calendar is a system of organizing days for social, religious, commercial, or administrative purposes. This is done by giving names to periods of time, typically days, weeks, months, and years. The name given to each day is known as a date. Periods in a calendar (such as years and months) are usually, though not necessarily, synchronized with the cycle of the sun or the moon.', 'calendar and system');	
	assert.ok(contains === true, 'true');
});

QUnit.test('... - aaa or calendar and system -> false', function(assert){
	var contains = jQuery.fn.jplist.domain.dom.services.FiltersService.advancedSearchParse('Architecture is both the process and product of planning, designing and construction. Architectural works, in the material form of buildings, are often perceived as cultural symbols and as works of art. Historical civilizations are often identified with their surviving architectural achievements.', 'calendar and system');	
	assert.ok(contains === false, 'false');
});

QUnit.test('... - aaa or calendar and system -> false', function(assert){
	var contains = jQuery.fn.jplist.domain.dom.services.FiltersService.advancedSearchParse('an arch is a structure that spans a space and supports a load. arches appeared as early as the 2nd millennium bc in mesopotamian brick architecture and their systematic use started with the ancient romans who were the first to apply the technique to a wide range of structures.', 'calendar and system');	
	assert.ok(contains === false, 'false');
});




