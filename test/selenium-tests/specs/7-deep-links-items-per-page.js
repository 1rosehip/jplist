var assert = require('assert');

describe('deep links initial state with items per page 5', function() {

    beforeAll(function(done){

        browser.url('/test/pages/1-mixed-deep-links.html#paging:number=5|sort:path~type~order=.like~number~asc|paging:currentPage=0')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('the number of items on the page should be as in deep link', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(5);
    });
});