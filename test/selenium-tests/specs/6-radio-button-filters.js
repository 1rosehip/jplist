var assert = require('assert');

describe('radio button filters with Sea', function() {

    beforeAll(function(done){

        browser.url('/test/pages/6-radio-button-filters.html')
            .click('(//label[@for="sea"])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('first item should have title Boats', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[1]')).toBe('Boats');
        browser.call(done);
    });

    it('number of items on the page should be 1', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(1);
    });

});


describe('radio button filters with Christmas', function() {

    beforeAll(function(done){

        browser.url('/test/pages/6-radio-button-filters.html')
            .click('(//label[@for="christmas"])[1]')
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

    it('number of items on the page should be 3', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(3);
    });

});
