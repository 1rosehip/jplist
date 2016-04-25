var assert = require('assert');

describe('button text filter with preselected Christmas button by default', function() {

    beforeAll(function(done){

        browser.url('/test/pages/6-button-text-filter.html')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('first item should have title Christmas', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[1]')).toBe('Christmas');
        browser.call(done);
    });

    it('second item should have title The Christmas Toy', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[2]')).toBe('The Christmas Toy');
        browser.call(done);
    });

    it('third item should have title Christmas Tree', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[3]')).toBe('Christmas Tree');
        browser.call(done);
    });

});

describe('button text filter uncheck Christmas and check Nature', function() {

    beforeAll(function(done){

        browser.url('/test/pages/6-button-text-filter.html')
            .click('(//span[@data-control-type="button-text-filter"][@data-text="christmas"])[1]')
            .click('(//span[@data-control-type="button-text-filter"][@data-text="nature"])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('first item should have title Autumn', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[1]')).toBe('Autumn');
        browser.call(done);
    });

    it('second item should have title Boats', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[2]')).toBe('Boats');
        browser.call(done);
    });

    it('third item should have title Coffee', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[3]')).toBe('Coffee');
        browser.call(done);
    });

});

describe('button text filter - Nature and Lifestyle together', function() {

    beforeAll(function(done){

        browser.url('/test/pages/6-button-text-filter.html')
            .click('(//span[@data-control-type="button-text-filter"][@data-text="christmas"])[1]')
            .click('(//span[@data-control-type="button-text-filter"][@data-text="nature"])[1]')
            .click('(//span[@data-control-type="button-text-filter"][@data-text="lifestyle"])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('first item should have title Coffee', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[1]')).toBe('Coffee');
        browser.call(done);
    });

    it('number of items on the page should be 1', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(1);
    });

});
