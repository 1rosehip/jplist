var assert = require('assert');

// --------- ADD ---------------------------------

describe('add item dynamically - check items number', function() {

    beforeAll(function(done){

        browser.url('/test/pages/1-mixed.html');

        browser.execute(function() {

            // browser context - you may not access client or console

            //init item html
            var html = '<div class="list-item box">\
				<div class="img left">\
					<img title="" alt="" src="../../demo/img/thumbs/book-1.jpg">\
				</div>\
				<div class="block right">\
					<p class="date">03/15/2012</p>\
					<p class="title">New Added Item</p>\
					<p class="desc">New Item Description</p>\
					<p class="like">100 Likes</p>\
					<p class="theme">\
						<span class="architecture">Lifestyle</span>\
					</p>\
				</div>\
			</div>';

            //add item to jPList collection in the given index
            $('#demo').jplist({
                command: 'add'
                ,commandData: {
                    $item: $(html)
                    ,index: 0
                }
            });
        });

        browser.call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('items number should be 17', function (done) {

        expect(browser.getText('(//div[@data-control-type="pagination-info"])[1]')).toBe('1 - 10 of 17');
        browser.call(done);
    });

});

describe('add item dynamically at index 0 - the items should appear first', function() {

    beforeAll(function(done){

        browser.url('/test/pages/1-mixed.html');

        browser.execute(function() {

            // browser context - you may not access client or console

            //init item html
            var html = '<div class="list-item box">\
				<div class="img left">\
					<img title="" alt="" src="../../demo/img/thumbs/book-1.jpg">\
				</div>\
				<div class="block right">\
					<p class="date">03/15/2012</p>\
					<p class="title">New Added Item</p>\
					<p class="desc">New Item Description</p>\
					<p class="like">100 Likes</p>\
					<p class="theme">\
						<span class="architecture">Lifestyle</span>\
					</p>\
				</div>\
			</div>';

            //add item to jPList collection in the given index
            $('#demo').jplist({
                command: 'add'
                ,commandData: {
                    $item: $(html)
                    ,index: 0
                }
            });
        });

        browser.call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('should appear first', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[1]')).toBe('New Added Item');
        browser.call(done);
    });

});

describe('add item dynamically at index 1 - the items should appear second', function() {

    beforeAll(function(done){

        browser.url('/test/pages/1-mixed.html');

        browser.execute(function() {

            // browser context - you may not access client or console

            //init item html
            var html = '<div class="list-item box">\
				<div class="img left">\
					<img title="" alt="" src="../../demo/img/thumbs/book-1.jpg">\
				</div>\
				<div class="block right">\
					<p class="date">03/15/2012</p>\
					<p class="title">New Added Item</p>\
					<p class="desc">New Item Description</p>\
					<p class="like">100 Likes</p>\
					<p class="theme">\
						<span class="architecture">Lifestyle</span>\
					</p>\
				</div>\
			</div>';

            //add item to jPList collection in the given index
            $('#demo').jplist({
                command: 'add'
                ,commandData: {
                    $item: $(html)
                    ,index: 1
                }
            });
        });

        browser.call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('should appear second', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[2]')).toBe('New Added Item');
        browser.call(done);
    });

});

describe('add item dynamically without index - the items should appear last', function() {

    beforeAll(function(done){

        browser.url('/test/pages/1-mixed.html')
                .click('(//button[@data-type="last"])[1]')

        browser.execute(function() {

            // browser context - you may not access client or console

            //init item html
            var html = '<div class="list-item box">\
				<div class="img left">\
					<img title="" alt="" src="../../demo/img/thumbs/book-1.jpg">\
				</div>\
				<div class="block right">\
					<p class="date">03/15/2012</p>\
					<p class="title">New Added Item</p>\
					<p class="desc">New Item Description</p>\
					<p class="like">100 Likes</p>\
					<p class="theme">\
						<span class="architecture">Lifestyle</span>\
					</p>\
				</div>\
			</div>';

            //add item to jPList collection in the given index
            $('#demo').jplist({
                command: 'add'
                ,commandData: {
                    $item: $(html)
                }
            });
        });

        browser.call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('should appear last', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[7]')).toBe('New Added Item');
        browser.call(done);
    });

});

// --------- ADD ARRAY OF ITEMS ------------------

describe('add array of items dynamically - check items number', function() {

    beforeAll(function(done){

        browser.url('/test/pages/1-mixed.html');

        browser.execute(function() {

            // browser context - you may not access client or console

            var items = [];

            items.push($(
                '<div class="list-item box">\
                    <div class="img left">\
                        <img title="" alt="" src="../../demo/img/thumbs/book-1.jpg">\
                    </div>\
                    <div class="block right">\
                        <p class="date">03/15/2012</p>\
                        <p class="title">New Added Item #1</p>\
                        <p class="desc">New Item Description</p>\
                        <p class="like">100 Likes</p>\
                        <p class="theme">\
                            <span class="architecture">Lifestyle</span>\
                        </p>\
                    </div>\
                </div>'
            ));

            items.push($(
                '<div class="list-item box">\
                    <div class="img left">\
                        <img title="" alt="" src="../../demo/img/thumbs/book-1.jpg">\
                    </div>\
                    <div class="block right">\
                        <p class="date">03/15/2012</p>\
                        <p class="title">New Added Item #2</p>\
                        <p class="desc">New Item Description</p>\
                        <p class="like">100 Likes</p>\
                        <p class="theme">\
                            <span class="architecture">Lifestyle</span>\
                        </p>\
                    </div>\
                </div>'
            ));

            items.push($(
                '<div class="list-item box">\
                    <div class="img left">\
                        <img title="" alt="" src="../../demo/img/thumbs/book-1.jpg">\
                    </div>\
                    <div class="block right">\
                        <p class="date">03/15/2012</p>\
                        <p class="title">New Added Item #3</p>\
                        <p class="desc">New Item Description</p>\
                        <p class="like">100 Likes</p>\
                        <p class="theme">\
                            <span class="architecture">Lifestyle</span>\
                        </p>\
                    </div>\
                </div>'
            ));

            //add item to jPList collection in the given index
            $('#demo').jplist({
                command: 'add'
                ,commandData: {
                    $items: items
                    ,index: 0
                }
            });
        });

        browser.call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('items number should be 19', function (done) {

        expect(browser.getText('(//div[@data-control-type="pagination-info"])[1]')).toBe('1 - 10 of 19');
        browser.call(done);
    });

});

describe('add array of items dynamically at index 0 - check their position', function() {

    beforeAll(function(done){

        browser.url('/test/pages/1-mixed.html');

        browser.execute(function() {

            // browser context - you may not access client or console

            var items = [];

            items.push($(
                '<div class="list-item box">\
                    <div class="img left">\
                        <img title="" alt="" src="../../demo/img/thumbs/book-1.jpg">\
                    </div>\
                    <div class="block right">\
                        <p class="date">03/15/2012</p>\
                        <p class="title">New Added Item #1</p>\
                        <p class="desc">New Item Description</p>\
                        <p class="like">100 Likes</p>\
                        <p class="theme">\
                            <span class="architecture">Lifestyle</span>\
                        </p>\
                    </div>\
                </div>'
            ));

            items.push($(
                '<div class="list-item box">\
                    <div class="img left">\
                        <img title="" alt="" src="../../demo/img/thumbs/book-1.jpg">\
                    </div>\
                    <div class="block right">\
                        <p class="date">03/15/2012</p>\
                        <p class="title">New Added Item #2</p>\
                        <p class="desc">New Item Description</p>\
                        <p class="like">100 Likes</p>\
                        <p class="theme">\
                            <span class="architecture">Lifestyle</span>\
                        </p>\
                    </div>\
                </div>'
            ));

            items.push($(
                '<div class="list-item box">\
                    <div class="img left">\
                        <img title="" alt="" src="../../demo/img/thumbs/book-1.jpg">\
                    </div>\
                    <div class="block right">\
                        <p class="date">03/15/2012</p>\
                        <p class="title">New Added Item #3</p>\
                        <p class="desc">New Item Description</p>\
                        <p class="like">100 Likes</p>\
                        <p class="theme">\
                            <span class="architecture">Lifestyle</span>\
                        </p>\
                    </div>\
                </div>'
            ));

            //add item to jPList collection in the given index
            $('#demo').jplist({
                command: 'add'
                ,commandData: {
                    $items: items
                    ,index: 0
                }
            });
        });

        browser.call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('should appear first', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[1]')).toBe('New Added Item #1');
        browser.call(done);
    });

    it('should appear second', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[2]')).toBe('New Added Item #2');
        browser.call(done);
    });

    it('should appear third', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[3]')).toBe('New Added Item #3');
        browser.call(done);
    });

});

describe('add array of items dynamically at index 1 - check their position', function() {

    beforeAll(function(done){

        browser.url('/test/pages/1-mixed.html');

        browser.execute(function() {

            // browser context - you may not access client or console

            var items = [];

            items.push($(
                '<div class="list-item box">\
                    <div class="img left">\
                        <img title="" alt="" src="../../demo/img/thumbs/book-1.jpg">\
                    </div>\
                    <div class="block right">\
                        <p class="date">03/15/2012</p>\
                        <p class="title">New Added Item #1</p>\
                        <p class="desc">New Item Description</p>\
                        <p class="like">100 Likes</p>\
                        <p class="theme">\
                            <span class="architecture">Lifestyle</span>\
                        </p>\
                    </div>\
                </div>'
            ));

            items.push($(
                '<div class="list-item box">\
                    <div class="img left">\
                        <img title="" alt="" src="../../demo/img/thumbs/book-1.jpg">\
                    </div>\
                    <div class="block right">\
                        <p class="date">03/15/2012</p>\
                        <p class="title">New Added Item #2</p>\
                        <p class="desc">New Item Description</p>\
                        <p class="like">100 Likes</p>\
                        <p class="theme">\
                            <span class="architecture">Lifestyle</span>\
                        </p>\
                    </div>\
                </div>'
            ));

            items.push($(
                '<div class="list-item box">\
                    <div class="img left">\
                        <img title="" alt="" src="../../demo/img/thumbs/book-1.jpg">\
                    </div>\
                    <div class="block right">\
                        <p class="date">03/15/2012</p>\
                        <p class="title">New Added Item #3</p>\
                        <p class="desc">New Item Description</p>\
                        <p class="like">100 Likes</p>\
                        <p class="theme">\
                            <span class="architecture">Lifestyle</span>\
                        </p>\
                    </div>\
                </div>'
            ));

            //add item to jPList collection in the given index
            $('#demo').jplist({
                command: 'add'
                ,commandData: {
                    $items: items
                    ,index: 1
                }
            });
        });

        browser.call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('should appear #2', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[2]')).toBe('New Added Item #1');
        browser.call(done);
    });

    it('should appear #3', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[3]')).toBe('New Added Item #2');
        browser.call(done);
    });

    it('should appear #4', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[4]')).toBe('New Added Item #3');
        browser.call(done);
    });

});

// -------- ADD A GROUP OF ITEMS -----------------

describe('add a group of items dynamically - check items number', function() {

    beforeAll(function(done){

        browser.url('/test/pages/1-mixed.html');

        browser.execute(function() {

            // browser context - you may not access client or console

            var $items = $(
                '<div class="list-item box">\
                    <div class="img left">\
                        <img title="" alt="" src="../../demo/img/thumbs/book-1.jpg">\
                    </div>\
                    <div class="block right">\
                        <p class="date">03/15/2012</p>\
                        <p class="title">New Added Item #1</p>\
                        <p class="desc">New Item Description</p>\
                        <p class="like">100 Likes</p>\
                        <p class="theme">\
                            <span class="architecture">Lifestyle</span>\
                        </p>\
                    </div>\
                </div>\
                <div class="list-item box">\
                    <div class="img left">\
                        <img title="" alt="" src="../../demo/img/thumbs/book-1.jpg">\
                    </div>\
                    <div class="block right">\
                        <p class="date">03/15/2012</p>\
                        <p class="title">New Added Item #2</p>\
                        <p class="desc">New Item Description</p>\
                        <p class="like">100 Likes</p>\
                        <p class="theme">\
                            <span class="architecture">Lifestyle</span>\
                        </p>\
                    </div>\
                </div>\
                <div class="list-item box">\
                    <div class="img left">\
                        <img title="" alt="" src="../../demo/img/thumbs/book-1.jpg">\
                    </div>\
                    <div class="block right">\
                        <p class="date">03/15/2012</p>\
                        <p class="title">New Added Item #3</p>\
                        <p class="desc">New Item Description</p>\
                        <p class="like">100 Likes</p>\
                        <p class="theme">\
                            <span class="architecture">Lifestyle</span>\
                        </p>\
                    </div>\
                </div>'
            );

            //add item to jPList collection in the given index
            $('#demo').jplist({
                command: 'add'
                ,commandData: {
                    $items: $items
                    ,index: 0
                }
            });
        });

        browser.call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('items number should be 19', function (done) {

        expect(browser.getText('(//div[@data-control-type="pagination-info"])[1]')).toBe('1 - 10 of 19');
        browser.call(done);
    });

});

describe('add a group of items dynamically at index 0 - check their position', function() {

    beforeAll(function(done){

        browser.url('/test/pages/1-mixed.html');

        browser.execute(function() {

            // browser context - you may not access client or console

            var $items = $(
                '<div class="list-item box">\
                    <div class="img left">\
                        <img title="" alt="" src="../../demo/img/thumbs/book-1.jpg">\
                    </div>\
                    <div class="block right">\
                        <p class="date">03/15/2012</p>\
                        <p class="title">New Added Item #1</p>\
                        <p class="desc">New Item Description</p>\
                        <p class="like">100 Likes</p>\
                        <p class="theme">\
                            <span class="architecture">Lifestyle</span>\
                        </p>\
                    </div>\
                </div>\
                <div class="list-item box">\
                    <div class="img left">\
                        <img title="" alt="" src="../../demo/img/thumbs/book-1.jpg">\
                    </div>\
                    <div class="block right">\
                        <p class="date">03/15/2012</p>\
                        <p class="title">New Added Item #2</p>\
                        <p class="desc">New Item Description</p>\
                        <p class="like">100 Likes</p>\
                        <p class="theme">\
                            <span class="architecture">Lifestyle</span>\
                        </p>\
                    </div>\
                </div>\
                <div class="list-item box">\
                    <div class="img left">\
                        <img title="" alt="" src="../../demo/img/thumbs/book-1.jpg">\
                    </div>\
                    <div class="block right">\
                        <p class="date">03/15/2012</p>\
                        <p class="title">New Added Item #3</p>\
                        <p class="desc">New Item Description</p>\
                        <p class="like">100 Likes</p>\
                        <p class="theme">\
                            <span class="architecture">Lifestyle</span>\
                        </p>\
                    </div>\
                </div>'
            );

            //add item to jPList collection in the given index
            $('#demo').jplist({
                command: 'add'
                ,commandData: {
                    $items: $items
                    ,index: 0
                }
            });
        });

        browser.call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('should appear first', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[1]')).toBe('New Added Item #1');
        browser.call(done);
    });

    it('should appear second', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[2]')).toBe('New Added Item #2');
        browser.call(done);
    });

    it('should appear third', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[3]')).toBe('New Added Item #3');
        browser.call(done);
    });

});

describe('add a group of items dynamically at index 1 - check their position', function() {

    beforeAll(function(done){

        browser.url('/test/pages/1-mixed.html');

        browser.execute(function() {

            // browser context - you may not access client or console

            var $items = $(
                '<div class="list-item box">\
                    <div class="img left">\
                        <img title="" alt="" src="../../demo/img/thumbs/book-1.jpg">\
                    </div>\
                    <div class="block right">\
                        <p class="date">03/15/2012</p>\
                        <p class="title">New Added Item #1</p>\
                        <p class="desc">New Item Description</p>\
                        <p class="like">100 Likes</p>\
                        <p class="theme">\
                            <span class="architecture">Lifestyle</span>\
                        </p>\
                    </div>\
                </div>\
                <div class="list-item box">\
                    <div class="img left">\
                        <img title="" alt="" src="../../demo/img/thumbs/book-1.jpg">\
                    </div>\
                    <div class="block right">\
                        <p class="date">03/15/2012</p>\
                        <p class="title">New Added Item #2</p>\
                        <p class="desc">New Item Description</p>\
                        <p class="like">100 Likes</p>\
                        <p class="theme">\
                            <span class="architecture">Lifestyle</span>\
                        </p>\
                    </div>\
                </div>\
                <div class="list-item box">\
                    <div class="img left">\
                        <img title="" alt="" src="../../demo/img/thumbs/book-1.jpg">\
                    </div>\
                    <div class="block right">\
                        <p class="date">03/15/2012</p>\
                        <p class="title">New Added Item #3</p>\
                        <p class="desc">New Item Description</p>\
                        <p class="like">100 Likes</p>\
                        <p class="theme">\
                            <span class="architecture">Lifestyle</span>\
                        </p>\
                    </div>\
                </div>'
            );

            //add item to jPList collection in the given index
            $('#demo').jplist({
                command: 'add'
                ,commandData: {
                    $items: $items
                    ,index: 1
                }
            });
        });

        browser.call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('should appear #2', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[2]')).toBe('New Added Item #1');
        browser.call(done);
    });

    it('should appear #3', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[3]')).toBe('New Added Item #2');
        browser.call(done);
    });

    it('should appear #4', function (done) {

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[4]')).toBe('New Added Item #3');
        browser.call(done);
    });

});

// -------- DELETE AND ITEM ----------------------

describe('add item dynamically and then delete it - check items number', function() {

    beforeAll(function(done){

        browser.url('/test/pages/1-mixed.html');

        browser.execute(function() {

            // browser context - you may not access client or console

            //init item html
            var html = '<div class="list-item box">\
				<div class="img left">\
					<img title="" alt="" src="../../demo/img/thumbs/book-1.jpg">\
				</div>\
				<div class="block right">\
					<p class="date">03/15/2012</p>\
					<p class="title">New Added Item</p>\
					<p class="desc">New Item Description</p>\
					<p class="like">100 Likes</p>\
					<p class="theme">\
						<span class="architecture">Lifestyle</span>\
					</p>\
				</div>\
			</div>';

            var $item = $(html);

            //add item to jPList collection in the given index
            $('#demo').jplist({
                command: 'add'
                ,commandData: {
                    $item: $item
                    ,index: 0
                }
            });

            //delete it
            $('#demo').jplist({
                command: 'del'
                ,commandData: {
                    $item: $item
                }
            });
        });

        browser.call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('items number should remain 16', function (done) {

        expect(browser.getText('(//div[@data-control-type="pagination-info"])[1]')).toBe('1 - 10 of 16');
        browser.call(done);
    });

});

//--------- DELETE ARRAY OF ITEMS ----------------

describe('add array of items dynamically and then delete them - check items number', function() {

    beforeAll(function(done){

        browser.url('/test/pages/1-mixed.html');

        browser.execute(function() {

            // browser context - you may not access client or console

            var items = [];

            items.push($(
                '<div class="list-item box">\
                    <div class="img left">\
                        <img title="" alt="" src="../../demo/img/thumbs/book-1.jpg">\
                    </div>\
                    <div class="block right">\
                        <p class="date">03/15/2012</p>\
                        <p class="title">New Added Item #1</p>\
                        <p class="desc">New Item Description</p>\
                        <p class="like">100 Likes</p>\
                        <p class="theme">\
                            <span class="architecture">Lifestyle</span>\
                        </p>\
                    </div>\
                </div>'
            ));

            items.push($(
                '<div class="list-item box">\
                    <div class="img left">\
                        <img title="" alt="" src="../../demo/img/thumbs/book-1.jpg">\
                    </div>\
                    <div class="block right">\
                        <p class="date">03/15/2012</p>\
                        <p class="title">New Added Item #2</p>\
                        <p class="desc">New Item Description</p>\
                        <p class="like">100 Likes</p>\
                        <p class="theme">\
                            <span class="architecture">Lifestyle</span>\
                        </p>\
                    </div>\
                </div>'
            ));

            items.push($(
                '<div class="list-item box">\
                    <div class="img left">\
                        <img title="" alt="" src="../../demo/img/thumbs/book-1.jpg">\
                    </div>\
                    <div class="block right">\
                        <p class="date">03/15/2012</p>\
                        <p class="title">New Added Item #3</p>\
                        <p class="desc">New Item Description</p>\
                        <p class="like">100 Likes</p>\
                        <p class="theme">\
                            <span class="architecture">Lifestyle</span>\
                        </p>\
                    </div>\
                </div>'
            ));

            //add items to jPList collection in the given index
            $('#demo').jplist({
                command: 'add'
                ,commandData: {
                    $items: items
                    ,index: 0
                }
            });

            //delete the items
            $('#demo').jplist({
                command: 'del'
                ,commandData: {
                    $items: items
                }
            });
        });

        browser.call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('items number should remain the same', function (done) {

        expect(browser.getText('(//div[@data-control-type="pagination-info"])[1]')).toBe('1 - 10 of 16');
        browser.call(done);
    });

});

//--------- DELETE A GROUP OF ITEMS --------------

describe('add a group of items dynamically and then delete them - check items number', function() {

    beforeAll(function(done){

        browser.url('/test/pages/1-mixed.html');

        browser.execute(function() {

            // browser context - you may not access client or console

            var $items = $(
                '<div class="list-item box">\
                    <div class="img left">\
                        <img title="" alt="" src="../../demo/img/thumbs/book-1.jpg">\
                    </div>\
                    <div class="block right">\
                        <p class="date">03/15/2012</p>\
                        <p class="title">New Added Item #1</p>\
                        <p class="desc">New Item Description</p>\
                        <p class="like">100 Likes</p>\
                        <p class="theme">\
                            <span class="architecture">Lifestyle</span>\
                        </p>\
                    </div>\
                </div>\
                <div class="list-item box">\
                    <div class="img left">\
                        <img title="" alt="" src="../../demo/img/thumbs/book-1.jpg">\
                    </div>\
                    <div class="block right">\
                        <p class="date">03/15/2012</p>\
                        <p class="title">New Added Item #2</p>\
                        <p class="desc">New Item Description</p>\
                        <p class="like">100 Likes</p>\
                        <p class="theme">\
                            <span class="architecture">Lifestyle</span>\
                        </p>\
                    </div>\
                </div>\
                <div class="list-item box">\
                    <div class="img left">\
                        <img title="" alt="" src="../../demo/img/thumbs/book-1.jpg">\
                    </div>\
                    <div class="block right">\
                        <p class="date">03/15/2012</p>\
                        <p class="title">New Added Item #3</p>\
                        <p class="desc">New Item Description</p>\
                        <p class="like">100 Likes</p>\
                        <p class="theme">\
                            <span class="architecture">Lifestyle</span>\
                        </p>\
                    </div>\
                </div>'
            );

            //add item to jPList collection in the given index
            $('#demo').jplist({
                command: 'add'
                ,commandData: {
                    $items: $items
                    ,index: 0
                }
            });

            //delete the items
            $('#demo').jplist({
                command: 'del'
                ,commandData: {
                    $items: $items
                }
            });
        });

        browser.call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('items number should remain the same', function (done) {

        expect(browser.getText('(//div[@data-control-type="pagination-info"])[1]')).toBe('1 - 10 of 16');
        browser.call(done);
    });

});


