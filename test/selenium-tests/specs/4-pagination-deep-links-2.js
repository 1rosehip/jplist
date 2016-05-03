var assert = require('assert');

describe('deep links initial state', function() {

    beforeAll(function(done){

        browser.url('/test/pages/4-pagination-deep-links.html#paging:currentPage=1|paging:number=5')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('the page number should be 2', function(){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(browser.getText('(//button[@class="jplist-current"])[1]')).toBe('2');
    });

});
