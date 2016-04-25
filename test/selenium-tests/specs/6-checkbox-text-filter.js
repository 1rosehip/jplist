var assert = require('assert');

describe('checkbox text filter with Nature', function() {

    beforeAll(function(done){

        browser.url('/test/pages/6-checkbox-text-filter.html')
            .click('(//label[@for="nature"])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('number of items on the page should be 2', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(7);
    });

});

describe('checkbox text filter with Nature', function() {

    beforeAll(function(done){

        browser.url('/test/pages/6-checkbox-text-filter.html')
            .click('(//label[@for="nature"])[1]')
            .click('(//label[@for="christmas"])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('number of items on the page should be 2', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(11);
    });

});

describe('checkbox text filter with Nature', function() {

    beforeAll(function(done){

        browser.url('/test/pages/6-checkbox-text-filter.html')
            .click('(//label[@for="nature"])[1]')
            .click('(//label[@for="christmas"])[1]')
            .click('(//label[@for="architecture"])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('number of items on the page should be 2', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(13);
    });

});