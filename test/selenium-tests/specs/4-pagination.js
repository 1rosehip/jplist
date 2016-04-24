var assert = require('assert');

describe('hidden sort desc', function() {

    beforeAll(function(done){

        browser.url('/test/pages/4-pagination.html')
            .click('(//button[@data-type="page"][@data-number="2"])[1]')
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