var assert = require('assert');

describe('sort by title asc (top)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/3-sort-buttons.html')
            .click('(//button[@data-path=".title"][@data-order="asc"][@data-type="text"])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('first item should have title Arch', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[1]')).toBe('Arch');
        browser.call(done);
    });

    it('second item should have title Architecture', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[2]')).toBe('Architecture');
        browser.call(done);
    });

    it('third item should have title Autumn', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[3]')).toBe('Autumn');
        browser.call(done);
    });

    it('item #4 should have title Boats', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[4]')).toBe('Boats');
        browser.call(done);
    });

    it('item #5 should have title Books', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[5]')).toBe('Books');
        browser.call(done);
    });

    it('bottom sort should have the same value as the top sort', function (done) {

        expect(browser.getText('(//button[@data-path=".title"][@data-order="asc"][@data-type="text"])[2]').indexOf('Sort by Title ASC') !== -1).toBe(true);
        browser.call(done);
    });

});

describe('sort by title asc (bottom)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/3-sort-buttons.html')
            .click('(//button[@data-path=".title"][@data-order="asc"][@data-type="text"])[2]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('first item should have title Arch', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[1]')).toBe('Arch');
        browser.call(done);
    });

    it('second item should have title Architecture', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[2]')).toBe('Architecture');
        browser.call(done);
    });

    it('third item should have title Autumn', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[3]')).toBe('Autumn');
        browser.call(done);
    });

    it('item #4 should have title Boats', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[4]')).toBe('Boats');
        browser.call(done);
    });

    it('item #5 should have title Books', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[5]')).toBe('Books');
        browser.call(done);
    });

    it('top sort should have the same value as the top bottom', function (done) {

        expect(browser.getText('(//button[@data-path=".title"][@data-order="asc"][@data-type="text"])[1]').indexOf('Sort by Title ASC') !== -1).toBe(true);
        browser.call(done);
    });

});

describe('sort by title desc (top)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/3-sort-buttons.html')
            .click('(//button[@data-path=".title"][@data-order="desc"][@data-type="text"])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('first item should have title The Christmas Toy', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[1]')).toBe('The Christmas Toy');
        browser.call(done);
    });

    it('second item should have title Crayons', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[2]')).toBe('Crayons');
        browser.call(done);
    });

    it('third item should have title Coins', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[3]')).toBe('Coins');
        browser.call(done);
    });

    it('item #4 should have title Coffee', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[4]')).toBe('Coffee');
        browser.call(done);
    });

    it('item #5 should have title City', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[5]')).toBe('City');
        browser.call(done);
    });

    it('bottom sort should have the same value as the top sort', function (done) {

        expect(browser.getText('(//button[@data-path=".title"][@data-order="desc"][@data-type="text"])[2]').indexOf('Sort by Title DESC') !== -1).toBe(true);
        browser.call(done);
    });

});

describe('sort by title desc (bottom)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/3-sort-buttons.html')
            .click('(//button[@data-path=".title"][@data-order="desc"][@data-type="text"])[2]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('first item should have title The Christmas Toy', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[1]')).toBe('The Christmas Toy');
        browser.call(done);
    });

    it('second item should have title Crayons', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[2]')).toBe('Crayons');
        browser.call(done);
    });

    it('third item should have title Coins', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[3]')).toBe('Coins');
        browser.call(done);
    });

    it('item #4 should have title Coffee', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[4]')).toBe('Coffee');
        browser.call(done);
    });

    it('item #5 should have title City', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[5]')).toBe('City');
        browser.call(done);
    });

    it('bottom sort should have the same value as the top sort', function (done) {

        expect(browser.getText('(//button[@data-path=".title"][@data-order="desc"][@data-type="text"])[1]').indexOf('Sort by Title DESC') !== -1).toBe(true);
        browser.call(done);
    });
});

describe('sort by date asc (top)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/3-sort-buttons.html')
            .click('(//button[@data-path=".date"][@data-order="asc"][@data-type="datetime"])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('first item should have 06/19/1981', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="date"])[1]')).toBe('06/19/1981');
        browser.call(done);
    });

    it('second item should have 03/08/1990', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="date"])[2]')).toBe('03/08/1990');
        browser.call(done);
    });

    it('third item should have 08/25/1991', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="date"])[3]')).toBe('08/25/1991');
        browser.call(done);
    });

    it('item #4 should have 06/10/1995', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="date"])[4]')).toBe('06/10/1995');
        browser.call(done);
    });

    it('item #5 should have 11/12/1998', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="date"])[5]')).toBe('11/12/1998');
        browser.call(done);
    });

    it('bottom sort should have the same value as the top sort', function (done) {

        expect(browser.getText('(//button[@data-path=".date"][@data-order="asc"][@data-type="datetime"])[2]').indexOf('Sort by Date ASC') !== -1).toBe(true);
        browser.call(done);
    });

});

describe('sort by date asc (bottom)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/3-sort-buttons.html')
            .click('(//button[@data-path=".date"][@data-order="asc"][@data-type="datetime"])[2]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('first item should have 06/19/1981', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="date"])[1]')).toBe('06/19/1981');
        browser.call(done);
    });

    it('second item should have 03/08/1990', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="date"])[2]')).toBe('03/08/1990');
        browser.call(done);
    });

    it('third item should have 08/25/1991', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="date"])[3]')).toBe('08/25/1991');
        browser.call(done);
    });

    it('item #4 should have 06/10/1995', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="date"])[4]')).toBe('06/10/1995');
        browser.call(done);
    });

    it('item #5 should have 11/12/1998', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="date"])[5]')).toBe('11/12/1998');
        browser.call(done);
    });

    it('bottom sort should have the same value as the top sort', function (done) {

        expect(browser.getText('(//button[@data-path=".date"][@data-order="asc"][@data-type="datetime"])[1]').indexOf('Sort by Date ASC') !== -1).toBe(true);
        browser.call(done);
    });

});

describe('sort by date desc (top)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/3-sort-buttons.html')
            .click('(//button[@data-path=".date"][@data-order="desc"][@data-type="datetime"])[1]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('first item should have 03/18/2012', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="date"])[1]')).toBe('03/18/2012');
        browser.call(done);
    });

    it('second item should have 03/15/2012', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="date"])[2]')).toBe('03/15/2012');
        browser.call(done);
    });

    it('third item should have 01/16/2011', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="date"])[3]')).toBe('01/16/2011');
        browser.call(done);
    });

    it('item #4 should have 09/01/2007', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="date"])[4]')).toBe('09/01/2007');
        browser.call(done);
    });

    it('item #5 should have 04/04/2006', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="date"])[5]')).toBe('04/04/2006');
        browser.call(done);
    });

    it('bottom sort should have the same value as the top sort', function (done) {

        expect(browser.getText('(//button[@data-path=".date"][@data-order="desc"][@data-type="datetime"])[2]').indexOf('Sort by Date DESC') !== -1).toBe(true);
        browser.call(done);
    });

});

describe('sort by date desc (bottom)', function() {

    beforeAll(function(done){

        browser.url('/test/pages/3-sort-buttons.html')
            .click('(//button[@data-path=".date"][@data-order="desc"][@data-type="datetime"])[2]')
            .call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('first item should have 03/18/2012', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="date"])[1]')).toBe('03/18/2012');
        browser.call(done);
    });

    it('second item should have 03/15/2012', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="date"])[2]')).toBe('03/15/2012');
        browser.call(done);
    });

    it('third item should have 01/16/2011', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="date"])[3]')).toBe('01/16/2011');
        browser.call(done);
    });

    it('item #4 should have 09/01/2007', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="date"])[4]')).toBe('09/01/2007');
        browser.call(done);
    });

    it('item #5 should have 04/04/2006', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="date"])[5]')).toBe('04/04/2006');
        browser.call(done);
    });

    it('bottom sort should have the same value as the top sort', function (done) {

        expect(browser.getText('(//button[@data-path=".date"][@data-order="desc"][@data-type="datetime"])[1]').indexOf('Sort by Date DESC') !== -1).toBe(true);
        browser.call(done);
    });

});



