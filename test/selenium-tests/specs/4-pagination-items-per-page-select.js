var assert = require('assert');

// ----------------- 5 items per page TOP ------------------

describe('click on page #3 (top)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/4-pagination-items-per-page-select.html')
            .click('(//button[@data-type="page"][@data-number="2"])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('number of items on the page should be 5', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(5);
    });
});

describe('click on the "next" button (top)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/4-pagination-items-per-page-select.html')
            .click('(//button[@data-type="next"])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('number of items on the page should be 5', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(5);
    });

    it('item #1 should have title Books', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[1]')).toBe('Books');
        browser.call(done);
    });

    it('item #2 should have title Business', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[2]')).toBe('Business');
        browser.call(done);
    });

    it('item #3 should have title Car', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[3]')).toBe('Car');
        browser.call(done);
    });

    it('item #4 should have title Christmas', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[4]')).toBe('Christmas');
        browser.call(done);
    });

    it('item #5 should have title The Christmas Toy', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[5]')).toBe('The Christmas Toy');
        browser.call(done);
    });
});

describe('click on the "last" button (top)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/4-pagination-items-per-page-select.html')
            .click('(//button[@data-type="last"])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('number of items on the page should be 3', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(3);
    });

    it('item #1 should have title Seesaw', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[1]')).toBe('Seesaw');
        browser.call(done);
    });

    it('item #2 should have title Winter Sun', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[2]')).toBe('Winter Sun');
        browser.call(done);
    });

    it('item #3 should have title Wood', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[3]')).toBe('Wood');
        browser.call(done);
    });

});

describe('click on "prev" button (top)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/4-pagination-items-per-page-select.html')
            .click('(//button[@data-type="page"][@data-number="1"])[1]')
            .click('(//button[@data-type="prev"])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('number of items on the page should be 5', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(5);
    });

    it('item #1 should have title Calendar', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[1]')).toBe('Calendar');
        browser.call(done);
    });

    it('item #2 should have title Architecture', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[2]')).toBe('Architecture');
        browser.call(done);
    });

    it('item #3 should have title Autumn', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[3]')).toBe('Autumn');
        browser.call(done);
    });

    it('item #4 should have title Boats', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[4]')).toBe('Boats');
        browser.call(done);
    });

    it('item #5 should have title Arch', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[5]')).toBe('Arch');
        browser.call(done);
    });
});

describe('click on "prev" button (top)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/4-pagination-items-per-page-select.html')
            .click('(//button[@data-type="page"][@data-number="1"])[1]')
            .click('(//button[@data-type="first"])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('number of items on the page should be 5', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(5);
    });

    it('item #1 should have title Calendar', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[1]')).toBe('Calendar');
        browser.call(done);
    });

    it('item #2 should have title Architecture', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[2]')).toBe('Architecture');
        browser.call(done);
    });

    it('item #3 should have title Autumn', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[3]')).toBe('Autumn');
        browser.call(done);
    });

    it('item #4 should have title Boats', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[4]')).toBe('Boats');
        browser.call(done);
    });

    it('item #5 should have title Arch', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[5]')).toBe('Arch');
        browser.call(done);
    });
});

// -------------- 5 items per page BOTTOM -----------------

describe('click on page #3 (bottom)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/4-pagination-items-per-page-select.html')
            .click('(//button[@data-type="page"][@data-number="2"])[2]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('number of items on the page should be 5', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(5);
    });
});

describe('click on the "next" button (bottom)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/4-pagination-items-per-page-select.html')
            .click('(//button[@data-type="next"])[2]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('number of items on the page should be 5', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(5);
    });

    it('item #1 should have title Books', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[1]')).toBe('Books');
        browser.call(done);
    });

    it('item #2 should have title Business', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[2]')).toBe('Business');
        browser.call(done);
    });

    it('item #3 should have title Car', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[3]')).toBe('Car');
        browser.call(done);
    });

    it('item #4 should have title Christmas', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[4]')).toBe('Christmas');
        browser.call(done);
    });

    it('item #5 should have title The Christmas Toy', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[5]')).toBe('The Christmas Toy');
        browser.call(done);
    });
});

describe('click on the "last" button (bottom)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/4-pagination-items-per-page-select.html')
            .click('(//button[@data-type="last"])[2]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('number of items on the page should be 3', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(3);
    });

    it('item #1 should have title Seesaw', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[1]')).toBe('Seesaw');
        browser.call(done);
    });

    it('item #2 should have title Winter Sun', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[2]')).toBe('Winter Sun');
        browser.call(done);
    });

    it('item #3 should have title Wood', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[3]')).toBe('Wood');
        browser.call(done);
    });

});

describe('click on "prev" button (bottom)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/4-pagination-items-per-page-select.html')
            .click('(//button[@data-type="page"][@data-number="1"])[2]')
            .click('(//button[@data-type="prev"])[2]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('number of items on the page should be 5', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(5);
    });

    it('item #1 should have title Calendar', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[1]')).toBe('Calendar');
        browser.call(done);
    });

    it('item #2 should have title Architecture', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[2]')).toBe('Architecture');
        browser.call(done);
    });

    it('item #3 should have title Autumn', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[3]')).toBe('Autumn');
        browser.call(done);
    });

    it('item #4 should have title Boats', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[4]')).toBe('Boats');
        browser.call(done);
    });

    it('item #5 should have title Arch', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[5]')).toBe('Arch');
        browser.call(done);
    });
});

describe('click on "prev" button (bottom)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/4-pagination-items-per-page-select.html')
            .click('(//button[@data-type="page"][@data-number="1"])[2]')
            .click('(//button[@data-type="first"])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('number of items on the page should be 5', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(5);
    });

    it('item #1 should have title Calendar', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[1]')).toBe('Calendar');
        browser.call(done);
    });

    it('item #2 should have title Architecture', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[2]')).toBe('Architecture');
        browser.call(done);
    });

    it('item #3 should have title Autumn', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[3]')).toBe('Autumn');
        browser.call(done);
    });

    it('item #4 should have title Boats', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[4]')).toBe('Boats');
        browser.call(done);
    });

    it('item #5 should have title Arch', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[5]')).toBe('Arch');
        browser.call(done);
    });
});

// ----------------- 3 items per page TOP ------------------

describe('select 3 items per page (top)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/4-pagination-items-per-page-select.html')
            .click('(//option[@data-number="3"])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('number of items on the page should be 3', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(3);
    });
});

describe('select 3 items per page and click on page #4 (top)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/4-pagination-items-per-page-select.html')
            .click('(//option[@data-number="3"])[1]')
            .click('(//button[@data-type="page"][@data-number="3"])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('number of items on the page should be 3', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(3);
    });

    it('item #1 should have title The Christmas Toy', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[1]')).toBe('The Christmas Toy');
        browser.call(done);
    });

    it('item #2 should have title Christmas Tree', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[2]')).toBe('Christmas Tree');
        browser.call(done);
    });

    it('item #3 should have title City', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[3]')).toBe('City');
        browser.call(done);
    });
});

describe('select 3 items per page and click on tje "next" page (top)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/4-pagination-items-per-page-select.html')
            .click('(//option[@data-number="3"])[1]')
            .click('(//button[@data-type="next"])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('number of items on the page should be 3', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(3);
    });

    it('item #1 should have title Boats', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[1]')).toBe('Boats');
        browser.call(done);
    });

    it('item #2 should have title Arch', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[2]')).toBe('Arch');
        browser.call(done);
    });

    it('item #3 should have title Books', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[3]')).toBe('Books');
        browser.call(done);
    });
});

describe('select 3 items per page and click on tje "last" page (top)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/4-pagination-items-per-page-select.html')
            .click('(//option[@data-number="3"])[1]')
            .click('(//button[@data-type="last"])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('number of items on the page should be 3', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(3);
    });

    it('item #1 should have title Seesaw', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[1]')).toBe('Seesaw');
        browser.call(done);
    });

    it('item #2 should have title Winter Sun', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[2]')).toBe('Winter Sun');
        browser.call(done);
    });

    it('item #3 should have title Wood', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[3]')).toBe('Wood');
        browser.call(done);
    });
});

// ----------------- 3 items per page BOTTOM ------------------

describe('select 3 items per page (bottom)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/4-pagination-items-per-page-select.html')
            .click('(//option[@data-number="3"])[2]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('number of items on the page should be 3', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(3);
    });
});


// ----------------- 10 items per page TOP ------------------

describe('select 10 items per page (top)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/4-pagination-items-per-page-select.html')
            .click('(//option[@data-number="10"])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('number of items on the page should be 10', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(10);
    });
});

// ----------------- 10 items per page BOTTOM ------------------

describe('select 10 items per page (bottom)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/4-pagination-items-per-page-select.html')
            .click('(//option[@data-number="10"])[2]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('number of items on the page should be 10', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(10);
    });
});



// ----------------- ALL items TOP ------------------

describe('select all items per page (top)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/4-pagination-items-per-page-select.html')
            .click('(//option[@data-number="all"])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('number of items on the page should be 33', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(33);
    });
});

// ----------------- All items BOTTOM ------------------

describe('select all items per page (bottom)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/4-pagination-items-per-page-select.html')
            .click('(//option[@data-number="all"])[2]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('number of items on the page should be 33', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(33);
    });
});

