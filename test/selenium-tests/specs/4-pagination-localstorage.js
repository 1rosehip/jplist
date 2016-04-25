var assert = require('assert');

describe('click on page #2 (top)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/4-pagination-localstorage.html')
            .click('(//button[@data-type="page"][@data-number="1"])[1]')
            .refresh()
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('top selected item should be #2', function(done){

        expect(browser.getText('(//button[@class="jplist-current"])[1]')).toBe('2');
        browser.call(done);
    });

    it('bottom selected item should be #2', function(done){

        expect(browser.getText('(//button[@class="jplist-current"])[2]')).toBe('2');
        browser.call(done);
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

describe('click on page #3 (bottom)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/4-pagination-localstorage.html')
            .click('(//button[@data-type="page"][@data-number="2"])[2]')
            .refresh()
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('top selected item should be #3', function(done){

        expect(browser.getText('(//button[@class="jplist-current"])[1]')).toBe('3');
        browser.call(done);
    });

    it('bottom selected item should be #3', function(done){

        expect(browser.getText('(//button[@class="jplist-current"])[2]')).toBe('3');
        browser.call(done);
    });

    it('item #1 should have title Christmas Tree', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[1]')).toBe('Christmas Tree');
        browser.call(done);
    });

    it('item #2 should have title City', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[2]')).toBe('City');
        browser.call(done);
    });

    it('item #3 should have title Capital City', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[3]')).toBe('Capital City');
        browser.call(done);
    });

    it('item #4 should have title Coffee', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[4]')).toBe('Coffee');
        browser.call(done);
    });

    it('item #5 should have title Coins', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[5]')).toBe('Coins');
        browser.call(done);
    });
});