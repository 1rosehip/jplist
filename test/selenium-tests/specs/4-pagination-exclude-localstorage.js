var assert = require('assert');

/*
 - i select another per page
 - and go to second page
 - and then refresh page,
 per page will reset
 */
describe('select items per page 10, click on page #2, refresh page (top)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/4-pagination-exclude-localstorage.html')
            .click('(//div[@class="jplist-dd-panel"])[1]')
            .click('(//li[span[@data-number="10"]])[1]')
            .click('(//button[@data-type="page"][@data-number="1"])[1]')
            .refresh()
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('pagination should return to the page 1', function(done){

        expect(browser.getText('(//button[@class="jplist-current"])[1]')).toBe('1');
        browser.call(done);
    });

    it('items per page should remain 10', function(done){

        expect(browser.getText('(//div[@data-control-type="items-per-page-drop-down"]//div[@class="jplist-dd-panel"])[1]')).toBe('10 per page');
        browser.call(done);
    });

    it('number of items on the page should be 10', function(done){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(10);
    });
});

/*
- I for the first go to second page
- and then select another per page
- and refresh page,
current page (2) stay saved,
*/
describe('click on page #2, select items per page 10, refresh page (top)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/4-pagination-exclude-localstorage.html')
            .click('(//button[@data-type="page"][@data-number="1"])[1]')
            .click('(//div[@class="jplist-dd-panel"])[1]')
            .click('(//li[span[@data-number="10"]])[1]')
            .refresh()
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('pagination should return to the page 1', function(done){

        expect(browser.getText('(//button[@class="jplist-current"])[1]')).toBe('1');
        browser.call(done);
    });

    it('items per page should remain 10', function(done){

        expect(browser.getText('(//div[@data-control-type="items-per-page-drop-down"]//div[@class="jplist-dd-panel"])[1]')).toBe('10 per page');
        browser.call(done);
    });

    it('number of items on the page should be 10', function(done){

        var boxes = browser.elements('//div[@class="list-item box"]');
        expect(boxes.value.length).toBe(10);
    });
});