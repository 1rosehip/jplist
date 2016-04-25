var assert = require('assert');

describe('button path filter group with Architecture and Lifestyle', function() {

    beforeAll(function(done){

        browser.url('/test/pages/6-button-path-filter-group.html')
            .click('(//span[@data-path=".architecture"])[1]')
            .click('(//span[@data-path=".lifestyle"])[1]')
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

describe('button path filter group with Christmas and Nature', function() {

    beforeAll(function(done){

        browser.url('/test/pages/6-button-path-filter-group.html')
            .click('(//span[@data-path=".christmas"])[1]')
            .click('(//span[@data-path=".nature"])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });
    
    it('the items list should be hidden', function(){

        var boxes = browser.elements('//div[@class="list box text-shadow jplist-hidden"]');
        expect(boxes.value.length).toBe(1);
    });

});

describe('button path filter group with Lifestyle and Nature', function() {

    beforeAll(function(done){

        browser.url('/test/pages/6-button-path-filter-group.html')
            .click('(//span[@data-path=".lifestyle"])[1]')
            .click('(//span[@data-path=".nature"])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });
    it('number of items on the page should be 9', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(9);
    });

});