var assert = require('assert');

describe('sort by title asc (top)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/3-sort-bootstrap.html')
            .click('//button[@id="dropdown-menu-1"]')
            .click('(//li[span[@data-path=".title"][@data-order="asc"][@data-type="text"]])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('first item should have title Arch', function (done) {

        expect(browser.getText('(//div[@class="list-item"]//p[@class="title"])[1]')).toBe('Arch');
        browser.call(done);
    });

    it('second item should have title Architecture', function (done) {

        expect(browser.getText('(//div[@class="list-item"]//p[@class="title"])[2]')).toBe('Architecture');
        browser.call(done);
    });

    it('third item should have title Autumn', function (done) {

        expect(browser.getText('(//div[@class="list-item"]//p[@class="title"])[3]')).toBe('Autumn');
        browser.call(done);
    });

    it('item #4 should have title Boats', function (done) {

        expect(browser.getText('(//div[@class="list-item"]//p[@class="title"])[4]')).toBe('Boats');
        browser.call(done);
    });

    it('item #5 should have title Books', function (done) {

        expect(browser.getText('(//div[@class="list-item"]//p[@class="title"])[5]')).toBe('Books');
        browser.call(done);
    });

    it('bottom sort should have the same value as the top sort', function (done) {

        expect(browser.getText('//button[@id="dropdown-menu-2"]/span[@data-type="selected-text"]')).toBe('Title A-Z');
        browser.call(done);
    });

});

describe('sort by title asc (bottom)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/3-sort-bootstrap.html')
            .click('//button[@id="dropdown-menu-2"]')
            .click('(//li[span[@data-path=".title"][@data-order="asc"][@data-type="text"]])[2]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('first item should have title Arch', function (done) {

        expect(browser.getText('(//div[@class="list-item"]//p[@class="title"])[1]')).toBe('Arch');
        browser.call(done);
    });

    it('second item should have title Architecture', function (done) {

        expect(browser.getText('(//div[@class="list-item"]//p[@class="title"])[2]')).toBe('Architecture');
        browser.call(done);
    });

    it('third item should have title Autumn', function (done) {

        expect(browser.getText('(//div[@class="list-item"]//p[@class="title"])[3]')).toBe('Autumn');
        browser.call(done);
    });

    it('item #4 should have title Boats', function (done) {

        expect(browser.getText('(//div[@class="list-item"]//p[@class="title"])[4]')).toBe('Boats');
        browser.call(done);
    });

    it('item #5 should have title Books', function (done) {

        expect(browser.getText('(//div[@class="list-item"]//p[@class="title"])[5]')).toBe('Books');
        browser.call(done);
    });

    it('top sort should have the same value as the top bottom', function (done) {

        expect(browser.getText('//button[@id="dropdown-menu-1"]')).toBe('Title A-Z');
        browser.call(done);
    });

});

describe('sort by title desc (top)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/3-sort-bootstrap.html')
            .click('//button[@id="dropdown-menu-1"]')
            .click('(//li[span[@data-path=".title"][@data-order="desc"][@data-type="text"]])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('first item should have title Wood', function (done) {

        expect(browser.getText('(//div[@class="list-item"]//p[@class="title"])[1]')).toBe('Wood');
        browser.call(done);
    });

    it('second item should have title Winter Sun', function (done) {

        expect(browser.getText('(//div[@class="list-item"]//p[@class="title"])[2]')).toBe('Winter Sun');
        browser.call(done);
    });

    it('third item should have title Winter', function (done) {

        expect(browser.getText('(//div[@class="list-item"]//p[@class="title"])[3]')).toBe('Winter');
        browser.call(done);
    });

    it('item #4 should have title Tree', function (done) {

        expect(browser.getText('(//div[@class="list-item"]//p[@class="title"])[4]')).toBe('Tree');
        browser.call(done);
    });

    it('item #5 should have title The Christmas Toy', function (done) {

        expect(browser.getText('(//div[@class="list-item"]//p[@class="title"])[5]')).toBe('The Christmas Toy');
        browser.call(done);
    });

    it('bottom sort should have the same value as the top sort', function (done) {

        expect(browser.getText('//button[@id="dropdown-menu-2"]')).toBe('Title Z-A');
        browser.call(done);
    });

});

describe('sort by likes number asc (top)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/3-sort-bootstrap.html')
            .click('//button[@id="dropdown-menu-1"]')
            .click('(//li[span[@data-path=".like"][@data-order="asc"][@data-type="number"]])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('first item should have 5 Likes', function (done) {

        expect(browser.getText('(//div[@class="list-item"]//p[@class="like"])[1]')).toBe('5 Likes');
        browser.call(done);
    });

    it('second item should have 7 Likes', function (done) {

        expect(browser.getText('(//div[@class="list-item"]//p[@class="like"])[2]')).toBe('7 Likes');
        browser.call(done);
    });

    it('third item should have 11 Likes', function (done) {

        expect(browser.getText('(//div[@class="list-item"]//p[@class="like"])[3]')).toBe('11 Likes');
        browser.call(done);
    });

    it('item #4 should have 12 Likes', function (done) {

        expect(browser.getText('(//div[@class="list-item"]//p[@class="like"])[4]')).toBe('12 Likes');
        browser.call(done);
    });

    it('item #5 should have 14 Likes', function (done) {

        expect(browser.getText('(//div[@class="list-item"]//p[@class="like"])[5]')).toBe('14 Likes');
        browser.call(done);
    });

    it('bottom sort should have the same value as the top sort', function (done) {

        expect(browser.getText('//button[@id="dropdown-menu-2"]')).toBe('Likes asc');
        browser.call(done);
    });

});

describe('sort by likes number desc (top)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/3-sort-bootstrap.html')
            .click('//button[@id="dropdown-menu-1"]')
            .click('(//li[span[@data-path=".like"][@data-order="desc"][@data-type="number"]])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('first item should have 321 Likes', function (done) {

        expect(browser.getText('(//div[@class="list-item"]//p[@class="like"])[1]')).toBe('321 Likes');
        browser.call(done);
    });

    it('second item should have 191 Likes', function (done) {

        expect(browser.getText('(//div[@class="list-item"]//p[@class="like"])[2]')).toBe('191 Likes');
        browser.call(done);
    });

    it('third item should have 128 Likes', function (done) {

        expect(browser.getText('(//div[@class="list-item"]//p[@class="like"])[3]')).toBe('128 Likes');
        browser.call(done);
    });

    it('item #4 should have 125 Likes', function (done) {

        expect(browser.getText('(//div[@class="list-item"]//p[@class="like"])[4]')).toBe('125 Likes');
        browser.call(done);
    });

    it('item #5 should have 100 Likes', function (done) {

        expect(browser.getText('(//div[@class="list-item"]//p[@class="like"])[5]')).toBe('100 Likes');
        browser.call(done);
    });

    it('bottom sort should have the same value as the top sort', function (done) {

        expect(browser.getText('//button[@id="dropdown-menu-2"]')).toBe('Likes desc');
        browser.call(done);
    });

});

describe('sort by date number asc (top)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/3-sort-bootstrap.html')
            .click('//button[@id="dropdown-menu-1"]')
            .click('(//li[span[@data-path=".date"][@data-order="asc"][@data-type="datetime"]])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('first item should have 03/03/1953', function (done) {

        expect(browser.getText('(//div[@class="list-item"]//p[@class="date"])[1]')).toBe('03/03/1953');
        browser.call(done);
    });

    it('second item should have 05/25/1965', function (done) {

        expect(browser.getText('(//div[@class="list-item"]//p[@class="date"])[2]')).toBe('05/25/1965');
        browser.call(done);
    });

    it('third item should have 06/19/1981', function (done) {

        expect(browser.getText('(//div[@class="list-item"]//p[@class="date"])[3]')).toBe('06/19/1981');
        browser.call(done);
    });

    it('item #4 should have 12/31/1986', function (done) {

        expect(browser.getText('(//div[@class="list-item"]//p[@class="date"])[4]')).toBe('12/31/1986');
        browser.call(done);
    });

    it('item #5 should have 03/08/1990', function (done) {

        expect(browser.getText('(//div[@class="list-item"]//p[@class="date"])[5]')).toBe('03/08/1990');
        browser.call(done);
    });

    it('bottom sort should have the same value as the top sort', function (done) {

        expect(browser.getText('//button[@id="dropdown-menu-2"]')).toBe('Date asc');
        browser.call(done);
    });

});

describe('sort by date number desc (top)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/3-sort-bootstrap.html')
            .click('//button[@id="dropdown-menu-1"]')
            .click('(//li[span[@data-path=".date"][@data-order="desc"][@data-type="datetime"]])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('first item should have 07/26/2012', function (done) {

        expect(browser.getText('(//div[@class="list-item"]//p[@class="date"])[1]')).toBe('07/26/2012');
        browser.call(done);
    });

    it('second item should have 03/19/2012', function (done) {

        expect(browser.getText('(//div[@class="list-item"]//p[@class="date"])[2]')).toBe('03/19/2012');
        browser.call(done);
    });

    it('third item should have 03/18/2012', function (done) {

        expect(browser.getText('(//div[@class="list-item"]//p[@class="date"])[3]')).toBe('03/18/2012');
        browser.call(done);
    });

    it('item #4 should have 03/15/2012', function (done) {

        expect(browser.getText('(//div[@class="list-item"]//p[@class="date"])[4]')).toBe('03/15/2012');
        browser.call(done);
    });

    it('item #5 should have 01/16/2011', function (done) {

        expect(browser.getText('(//div[@class="list-item"]//p[@class="date"])[5]')).toBe('01/16/2011');
        browser.call(done);
    });

    it('bottom sort should have the same value as the top sort', function (done) {

        expect(browser.getText('//button[@id="dropdown-menu-2"]')).toBe('Date desc');
        browser.call(done);
    });

});


