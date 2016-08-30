var assert = require('assert');

/*
 - i select another per page
 - and go to second page
 - and then refresh page,
 per page will reset

describe('select items per page 10, click on page #2, refresh page (top)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/4-bootstrap-pagination-exclude-localstorage.html')
            .click('//button[@id="dropdown-menu-1"]')
            .click('(//a[@data-number="10"])[1]')
            .click('(//li[@data-type="page"][@data-number="1"])[1]')
            .refresh()
            .pause(500)
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('pagination should return to the page 1', function(done){

        expect(browser.getText('(//li[@class="jplist-current active"])[1]')).toBe('1');
        browser.call(done);
    });

    it('items per page should remain 10', function(done){

        expect(browser.getText('(//button[@id="dropdown-menu-1"]/span[@data-type="selected-text"])[1]')).toBe('10 per page');
        browser.call(done);
    });

    it('number of items on the page should be 10', function(done){

        var boxes = browser.elements('//div[@class="list-item"]');
        expect(boxes.value.length).toBe(10);
    });
});
 */