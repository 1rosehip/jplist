var assert = require('assert');


describe('basic text filter', function() {

    beforeAll(function(done){

        //navigate to the 2-text-filter.html
        browser.url('/test/pages/2-text-filter.html');
        browser.setValue('(//input[@data-path=".title"])[1]', 'oo');
        browser.call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('first item should have title Books', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[1]')).toBe('Books');
        browser.call(done);
    });

    it('second item should have title Wood', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[2]')).toBe('Wood');
        browser.call(done);
    });

    it('bottom filter should have the same value as the top filter', function (done) {

        expect(browser.getValue('(//input[@data-path=".title"])[2]')).toBe('oo');
        browser.call(done);
    });

});