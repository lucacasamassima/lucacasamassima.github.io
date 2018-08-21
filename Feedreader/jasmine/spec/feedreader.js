/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */
/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function () {
    'use strict';
    /* This is our first test suite - a test suite just contains
     * a related set of tests. This suite is all about the RSS
     * feeds definitions, the allFeeds variable in our application.
     */
    describe('RSS Feeds', function () {
        /* This is our first test - it tests to make sure that the
         * allFeeds variable has been defined and that it is not
         * empty. Experiment with this before you get started on
         * the rest of this project. What happens when you change
         * allFeeds in app.js to be an empty array and refresh the
         * page?
         */
        it('are defined', function () {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toEqual('');
        });


        /* TODO: Write a test that loops through each feed
         * in the allFeeds object and ensures it has a URL defined
         * and that the URL is not empty.
         */

        it('urls are defined', function () {
            allFeeds.forEach(function (feed) {
                expect(feed.url).toBeTruthy();
            });
        });

        /* TODO: Write a test that loops through each feed
         * in the allFeeds object and ensures it has a name defined
         * and that the name is not empty.
         */

        it('names are defined', function () {
            allFeeds.forEach(function (feed) {
                expect(feed.name).toBeDefined();
                expect(feed.name).not.toEqual('');
            });

        });

    });


    /* TODO: Write a new test suite named "The menu" */

    describe('The menu', function () {

        /* TODO: Write a test that ensures the menu element is
         * hidden by default. You'll have to analyze the HTML and
         * the CSS to determine how we're performing the
         * hiding/showing of the menu element.
         */

        it('menu element is hidden ', function () {
            // the item is hidden
            //$('.menu-icon-link').click();
            expect($("body").hasClass('menu-hidden')).toBe(true);

        });

        /* TODO: Write a test that ensures the menu changes
         * visibility when the menu icon is clicked. This test
         * should have two expectations: does the menu display when
         * clicked and does it hide when clicked again.
         */

        it('menu element is visible', function () {

            $('.menu-icon-link').click();
            expect($('body').hasClass('menu-hidden')).toBe(false);
            $('.menu-icon-link').click();
            expect($('body').hasClass('menu-hidden')).toBe(true);


        });

    });

    /* TODO: Write a new test suite named "Initial Entries" */


    describe('Initial Entries', function () {
        /* TODO: Write a test that ensures when the loadFeed
         * function is called and completes its work, there is at least
         * a single .entry element within the .feed container.
         * Remember, loadFeed() is asynchronous so this test will require
         * the use of Jasmine's beforeEach and asynchronous done() function.
         */

         

         var feeddata;

         beforeEach(function (done) {
            loadFeed(0, done);
            feeddata = $('.feed').html();
         });



        it('at least one .entry element', function () {
            // had to add the length to the .feed .entry class
            // it would not work .length.toBeGreaterThan();
            // properties did not appear to chain.
            // saw this link so i could fix line 127 https://discussions.udacity.com/t/unexpected-trouble-with-initial-entries-test/195850
            var feedlength = $('.feed .entry').length;
            expect(feedlength).toBeGreaterThan(0);
        });
    });

    /* TODO: Write a new test suite named "New Feed Selection" */
    describe('New Feed Selection', function () {
        /* TODO: Write a test that ensures when a new feed is loaded
        * by the loadFeed function that the content actually changes.
        * Remember, loadFeed() is asynchronous.
        */
        // asynchronous function
        var feeddata1, feeddata2;
        beforeEach(function (done) {
            // loadFeed takes an indicies value

            loadFeed(0, function () {
                feeddata1 = $('.feed').html();
                //console.log(feeddata1)
                loadFeed(1, function () {
                    feeddata2 = $('.feed').html();
                    done();
                });

            });
        }); //.beforeEach


        it('is a new feed item added', function () {
            // load the first item using the loadFeed function
            // the init is set to zero for the first value
            // looked at example from
            expect(feeddata1).not.toEqual(feeddata2);
        });
    });
}());