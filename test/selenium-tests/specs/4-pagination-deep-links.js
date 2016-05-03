var assert = require('assert');

describe('deep links initial state', function() {

    beforeAll(function(done){

        browser.url('/test/pages/4-pagination-deep-links.html')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('check that initial url contains deep link', function(){

        //browser.pause(1000);
        var url = browser.getUrl();

        expect(url).toBe('http://jplist.local/test/pages/4-pagination-deep-links.html#paging:currentPage=0|paging:number=5');
    });

    it('the number of items on the page should be as in deep link', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(5);
    });

    it('url should change after clicking on the page 2', function(){

        browser.click('(//button[@data-type="page"][@data-number="1"])[1]');
        var url = browser.getUrl();
        expect(url).toBe('http://jplist.local/test/pages/4-pagination-deep-links.html#paging:currentPage=1|paging:number=5');
    });
});
