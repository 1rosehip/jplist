var assert = require('assert');

describe('range slider toggle filter with Likes: 50 - 100', function() {

    beforeAll(function(done){

        browser.url('/test/pages/6-range-slider-toggle-filter.html')
            .click('(//span[@data-control-type="range-filter"][@data-path=".like"][@data-min="50"][@data-max="100"])[1]')
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

describe('range slider toggle filter with Views: 20 - 200', function() {

    beforeAll(function(done){

        browser.url('/test/pages/6-range-slider-toggle-filter.html')
            .click('(//span[@data-control-type="range-filter"][@data-path=".view"][@data-min="20"][@data-max="200"])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('number of items on the page should be 19', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(19);
    });

});

describe('range slider toggle filter with Prices: 30+', function() {

    beforeAll(function(done){

        browser.url('/test/pages/6-range-slider-toggle-filter.html')
            .click('(//span[@data-control-type="range-filter"][@data-path=".price"][@data-min="30"])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('number of items on the page should be 8', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(8);
    });

});

describe('range slider toggle filter with Likes: 50 - 100 an Prices: 30+', function() {

    beforeAll(function(done){

        browser.url('/test/pages/6-range-slider-toggle-filter.html')
            .click('(//span[@data-control-type="range-filter"][@data-path=".like"][@data-min="50"][@data-max="100"])[1]')
            .click('(//span[@data-control-type="range-filter"][@data-path=".price"][@data-min="30"])[1]')
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

describe('range slider toggle filter with Views: 20 - 200 an Prices: 30+', function() {

    beforeAll(function(done){

        browser.url('/test/pages/6-range-slider-toggle-filter.html')
            .click('(//span[@data-control-type="range-filter"][@data-path=".view"][@data-min="20"][@data-max="200"])[1]')
            .click('(//span[@data-control-type="range-filter"][@data-path=".price"][@data-min="30"])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('number of items on the page should be 2', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(2);
    });

});
