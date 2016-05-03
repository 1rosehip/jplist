var assert = require('assert');

describe('deep links initial state', function() {

    beforeAll(function(done){

        browser.url('/test/pages/1-mixed-deep-links.html')
                .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('check that initial url contains deep link', function(){

        //browser.pause(1000);
        var url = browser.getUrl();

        expect(url).toBe('http://jplist.local/test/pages/1-mixed-deep-links.html#paging:number=10|sort:path~type~order=.like~number~asc|paging:currentPage=0');
    });

    it('the number of items on the page should be as in deep link', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(10);
    });
});

describe('deep links items per page dropdown (top)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/1-mixed-deep-links.html')
                .click('(//div[@class="jplist-dd-panel"])[1]')
                .click('(//li[span[@data-number="5"]])[1]')
                .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('items per page dropdown change should change deep link', function(){

        //browser.pause(1000);
        var url = browser.getUrl();

        expect(url).toBe('http://jplist.local/test/pages/1-mixed-deep-links.html#paging:number=5|sort:path~type~order=.like~number~asc|paging:currentPage=0');
    });

    it('the number of items on the page should be as in deep link', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(5);
    });

});

describe('deep links items per page dropdown and pagination button (top)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/1-mixed-deep-links.html')
            .click('(//div[@class="jplist-dd-panel"])[1]')
            .click('(//li[span[@data-number="5"]])[1]')
            .click('(//button[@data-type="page"][@data-number="1"])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('deepmlink should change according the controls', function(){

        //browser.pause(1000);
        var url = browser.getUrl();

        expect(url).toBe('http://jplist.local/test/pages/1-mixed-deep-links.html#paging:number=5|sort:path~type~order=.like~number~asc|paging:currentPage=1');
    });

    it('the number of items on the page should be as in deep link', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(5);
    });

    it('the page number should be 2', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(browser.getText('(//button[@class="jplist-current"])[1]')).toBe('2');
    });

});

describe('deep links items per page dropdown (bottom)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/1-mixed-deep-links.html')
            .click('(//div[@class="jplist-dd-panel"])[1]')
            .click('(//li[span[@data-number="3"]])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('items per page dropdown change should change deep link', function(){

        //browser.pause(1000);
        var url = browser.getUrl();

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(3);
    });

});