var assert = require('assert');

describe('dropdown filter by Architecture (top)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/5-filter-dropdown.html')
            .click('(//div[@class="jplist-dd-panel"])[1]')
            .click('(//li[span[@data-path=".architecture"]])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('first item should have title Architecture', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[1]')).toBe('Architecture');
        browser.call(done);
    });

    it('second item should have title Arch', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[2]')).toBe('Arch');
        browser.call(done);
    });

    it('third item should have title City', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[3]')).toBe('City');
        browser.call(done);
    });

    it('item #4 should have title Capital City', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[4]')).toBe('Capital City');
        browser.call(done);
    });

    it('item #5 should have title Fountains', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[5]')).toBe('Fountains');
        browser.call(done);
    });

    it('bottom sort should have the same value as the top sort', function (done) {

        expect(browser.getText('(//div[@class="jplist-dd-panel"])[2]')).toBe('Architecture');
        browser.call(done);
    });

});

describe('dropdown filter by Architecture (bottom)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/5-filter-dropdown.html')
            .click('(//div[@class="jplist-dd-panel"])[2]')
            .click('(//li[span[@data-path=".architecture"]])[2]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('first item should have title Architecture', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[1]')).toBe('Architecture');
        browser.call(done);
    });

    it('second item should have title Arch', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[2]')).toBe('Arch');
        browser.call(done);
    });

    it('third item should have title City', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[3]')).toBe('City');
        browser.call(done);
    });

    it('item #4 should have title Capital City', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[4]')).toBe('Capital City');
        browser.call(done);
    });

    it('item #5 should have title Fountains', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[5]')).toBe('Fountains');
        browser.call(done);
    });

    it('bottom sort should have the same value as the top sort', function (done) {

        expect(browser.getText('(//div[@class="jplist-dd-panel"])[1]')).toBe('Architecture');
        browser.call(done);
    });

});

describe('dropdown filter by Christmas (top)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/5-filter-dropdown.html')
            .click('(//div[@class="jplist-dd-panel"])[1]')
            .click('(//li[span[@data-path=".christmas"]])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('first item should have title Christmas', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[1]')).toBe('Christmas');
        browser.call(done);
    });

    it('second item should have title The Christmas Toy', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[2]')).toBe('The Christmas Toy');
        browser.call(done);
    });

    it('third item should have title Christmas Tree', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[3]')).toBe('Christmas Tree');
        browser.call(done);
    });
});


describe('dropdown filter by Food (top)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/5-filter-dropdown.html')
            .click('(//div[@class="jplist-dd-panel"])[1]')
            .click('(//li[span[@data-path=".food"]])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('first item should have title Coffee', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[1]')).toBe('Coffee');
        browser.call(done);
    });

    it('second item should have title Cupcakes', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[2]')).toBe('Cupcakes');
        browser.call(done);
    });
});