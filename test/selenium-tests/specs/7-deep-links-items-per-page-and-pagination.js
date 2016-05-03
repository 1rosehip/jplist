var assert = require('assert');

describe('deep links initial state with items per page 5', function() {

    beforeAll(function(done){

        browser.url('http://jplist.local/test/pages/1-mixed-deep-links.html#paging:number=5|sort:path~type~order=.like~number~asc|paging:currentPage=1')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('the number of items on the page should be 5', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(5);
    });

    it('the page number should be 2', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(browser.getText('(//button[@class="jplist-current"])[1]')).toBe('2');
    });
});