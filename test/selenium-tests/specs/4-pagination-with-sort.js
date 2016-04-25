var assert = require('assert');

describe('sort by title desc (top)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/4-pagination-with-sort.html')
            .click('(//div[@data-control-type="sort-drop-down"]//div[@class="jplist-dd-panel"])[1]')
            .click('(//li[span[@data-path=".title"][@data-order="desc"][@data-type="text"]])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('first item should have title Wood', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[1]')).toBe('Wood');
        browser.call(done);
    });

    it('second item should have title Winter Sun', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[2]')).toBe('Winter Sun');
        browser.call(done);
    });

    it('third item should have title Winter', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[3]')).toBe('Winter');
        browser.call(done);
    });

    it('item #4 should have title Tree', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[4]')).toBe('Tree');
        browser.call(done);
    });

    it('item #5 should have title The Christmas Toy', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[5]')).toBe('The Christmas Toy');
        browser.call(done);
    });

    it('bottom sort should have the same value as the top sort', function (done) {

        expect(browser.getText('(//div[@data-control-type="sort-drop-down"]//div[@class="jplist-dd-panel"])[2]')).toBe('Title Z-A');
        browser.call(done);
    });

    it('number of items on the page should be 5', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(5);
    });

});

describe('sort by title desc and go to the page #3 (top)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/4-pagination-with-sort.html')
            .click('(//div[@data-control-type="sort-drop-down"]//div[@class="jplist-dd-panel"])[1]')
            .click('(//li[span[@data-path=".title"][@data-order="desc"][@data-type="text"]])[1]')
            .click('(//button[@data-type="page"][@data-number="2"])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('first item should have title Nests', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[1]')).toBe('Nests');
        browser.call(done);
    });

    it('second item should have title Leaves', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[2]')).toBe('Leaves');
        browser.call(done);
    });

    it('third item should have title Landscapes', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[3]')).toBe('Landscapes');
        browser.call(done);
    });

    it('item #4 should have title Fountains', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[4]')).toBe('Fountains');
        browser.call(done);
    });

    it('item #5 should have title Flowering Plant', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[5]')).toBe('Flowering Plant');
        browser.call(done);
    });

    it('bottom sort should have the same value as the top sort', function (done) {

        expect(browser.getText('(//div[@data-control-type="sort-drop-down"]//div[@class="jplist-dd-panel"])[2]')).toBe('Title Z-A');
        browser.call(done);
    });

    it('number of items on the page should be 5', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(5);
    });

});

describe('sort by title desc, select 3 items per page and go to the page #5 (top)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/4-pagination-with-sort.html')
            .click('(//div[@data-control-type="sort-drop-down"]//div[@class="jplist-dd-panel"])[1]')
            .click('(//li[span[@data-path=".title"][@data-order="desc"][@data-type="text"]])[1]')
            .click('(//div[@data-control-type="items-per-page-drop-down"]//div[@class="jplist-dd-panel"])[1]')
            .click('(//li[span[@data-number="3"]])[1]')
            .click('(//button[@data-type="page"][@data-number="4"])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('first item should have title Landscapes', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[1]')).toBe('Landscapes');
        browser.call(done);
    });

    it('second item should have title Fountains', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[2]')).toBe('Fountains');
        browser.call(done);
    });

    it('third item should have title Flowering Plant', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[3]')).toBe('Flowering Plant');
        browser.call(done);
    });

    it('bottom sort should have the same value as the top sort', function (done) {

        expect(browser.getText('(//div[@data-control-type="sort-drop-down"]//div[@class="jplist-dd-panel"])[2]')).toBe('Title Z-A');
        browser.call(done);
    });

    it('bottom items per page dropdown should have the same value as the top sort', function (done) {

        expect(browser.getText('(//div[@data-control-type="items-per-page-drop-down"]//div[@class="jplist-dd-panel"])[2]')).toBe('3 per page');
        browser.call(done);
    });

    it('number of items on the page should be 3', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(3);
    });

});

