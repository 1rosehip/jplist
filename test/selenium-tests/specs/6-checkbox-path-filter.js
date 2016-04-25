var assert = require('assert');

describe('checkbox path filter with Architecture and Lifestyle', function() {

    beforeAll(function(done){

        browser.url('/test/pages/6-checkbox-path-filter.html')
            .click('(//label[@for="architecture"])[1]')
            .click('(//label[@for="red-color"])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('first item should have title Arch', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[1]')).toBe('Arch');
        browser.call(done);
    });

    it('second item should have title Capital City', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[2]')).toBe('Capital City');
        browser.call(done);
    });

    it('number of items on the page should be 2', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(2);
    });

});

describe('checkbox path filter with Christmas and Nature', function() {

    beforeAll(function(done){

        browser.url('/test/pages/6-checkbox-path-filter.html')
            .click('(//label[@for="christmas"])[1]')
            .click('(//label[@for="nature"])[1]')
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

    it('third item should have title Christmas', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[3]')).toBe('Christmas');
        browser.call(done);
    });

    it('number of items on the page should be 6', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(6);
    });

});

describe('checkbox path filter with Blue and Nature', function() {

    beforeAll(function(done){

        browser.url('/test/pages/6-checkbox-path-filter.html')
            .click('(//label[@for="nature"])[1]')
            .click('(//label[@for="blue-color"])[1]')
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

describe('checkbox path filter with Blue', function() {

    beforeAll(function(done){

        browser.url('/test/pages/6-checkbox-path-filter.html')
            .click('(//label[@for="blue-color"])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('first item should have title Books', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[1]')).toBe('Books');
        browser.call(done);
    });

    it('second item should have title Coffee', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[2]')).toBe('Coffee');
        browser.call(done);
    });

    it('number of items on the page should be 2', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(2);
    });

});