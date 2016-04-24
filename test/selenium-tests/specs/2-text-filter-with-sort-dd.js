var assert = require('assert');

describe('filter with oo and then sort z-a (top)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/2-text-filter-with-sort.html')
            .setValue('(//input[@data-path=".title"])[1]', 'oo')
            .click('(//div[@class="jplist-dd-panel"])[1]')
            .click('(//li[span[@data-path=".title"][@data-order="desc"][@data-type="text"]])[1]')
            //.pause(5000)
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('first item should have title Wood', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[1]')).toBe('Wood');
        browser.call(done);
    });

    it('second item should have title Books', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[2]')).toBe('Books');
        browser.call(done);
    });

    it('bottom filter should have the same value as the top filter', function (done) {

        expect(browser.getValue('(//input[@data-path=".title"])[2]')).toBe('oo');
        browser.call(done);
    });

    it('bottom sort should have the same value as the top sort', function (done) {

        expect(browser.getText('(//div[@class="jplist-dd-panel"])[2]')).toBe('Title Z-A');
        browser.call(done);
    });

});

describe('sort z-a and then filter with oo (top)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/2-text-filter-with-sort.html')
            .click('(//div[@class="jplist-dd-panel"])[1]')
            .click('(//span[@data-path=".title"][@data-order="desc"][@data-type="text"])[1]')
            .setValue('(//input[@data-path=".title"])[1]', 'oo')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('first item should have title Wood', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[1]')).toBe('Wood');
        browser.call(done);
    });

    it('second item should have title Books', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[2]')).toBe('Books');
        browser.call(done);
    });

    it('bottom filter should have the same value as the top filter', function (done) {

        expect(browser.getValue('(//input[@data-path=".title"])[2]')).toBe('oo');
        browser.call(done);
    });

    it('bottom sort should have the same value as the top sort', function (done) {

        expect(browser.getText('(//div[@class="jplist-dd-panel"])[2]')).toBe('Title Z-A');
        browser.call(done);
    });

});

describe('filter with oo and then sort z-a (bottom)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/2-text-filter-with-sort.html')
            .setValue('(//input[@data-path=".title"])[2]', 'oo')
            .click('(//div[@class="jplist-dd-panel"])[2]')
            .click('(//li[span[@data-path=".title"][@data-order="desc"][@data-type="text"]])[2]')
            //.pause(5000)
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('first item should have title Wood', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[1]')).toBe('Wood');
        browser.call(done);
    });

    it('second item should have title Books', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[2]')).toBe('Books');
        browser.call(done);
    });

    it('bottom filter should have the same value as the top filter', function (done) {

        expect(browser.getValue('(//input[@data-path=".title"])[1]')).toBe('oo');
        browser.call(done);
    });

    it('bottom sort should have the same value as the top sort', function (done) {

        expect(browser.getText('(//div[@class="jplist-dd-panel"])[1]')).toBe('Title Z-A');
        browser.call(done);
    });

});

describe('sort z-a and then filter with oo (bottom)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/2-text-filter-with-sort.html')
            .click('(//div[@class="jplist-dd-panel"])[2]')
            .click('(//span[@data-path=".title"][@data-order="desc"][@data-type="text"])[2]')
            .setValue('(//input[@data-path=".title"])[2]', 'oo')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('first item should have title Wood', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[1]')).toBe('Wood');
        browser.call(done);
    });

    it('second item should have title Books', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[2]')).toBe('Books');
        browser.call(done);
    });

    it('bottom filter should have the same value as the top filter', function (done) {

        expect(browser.getValue('(//input[@data-path=".title"])[1]')).toBe('oo');
        browser.call(done);
    });

    it('bottom sort should have the same value as the top sort', function (done) {

        expect(browser.getText('(//div[@class="jplist-dd-panel"])[1]')).toBe('Title Z-A');
        browser.call(done);
    });

});