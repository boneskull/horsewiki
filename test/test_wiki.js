/*global module, test, ok, strictEqual, equal, angular, COUCHDB_URL*/
(function () {
    'use strict';

    var injector = angular.injector(['ng', 'ngMock', 'wiki']);

    function setup() {
    }

    function teardown() {

    }

    var init = {
        setup: function () {
            setup.call(this);
        },
        teardown: function () {
            teardown.call(this);
        }
    };

    module('factories', init);

    test('UniqueIdentifier', 1, function () {
        var output = injector.get('UniqueIdentifier')();
        var regex = /.{8}-.{4}-.{4}-.{4}-.{12}/;

        ok(output.match(regex), 'assert UniqueIdentifier outputs a GUID');
    });

    test('Page', 2, function () {
        var Page = injector.get('Page'), id = 'Foo', title = 'Foo', createdon = Date.now(),
            response = {foo: 'bar'}, $httpBackend = injector.get('$httpBackend'), page, result;

        $httpBackend.expect('PUT', COUCHDB_URL + '/' + id, {title: title, createdon: createdon}).respond(200, response);

        page = Page.create({id: id}, {title: title, createdon: createdon});

        $httpBackend.flush();

        equal(page.foo, response.foo, 'assert correct method used to create');

        $httpBackend.expect('PUT', COUCHDB_URL + '/' + id, {title: title, createdon: createdon}).respond(200, response);

        result = Page.save({id: id}, {title: title, createdon: createdon});

        $httpBackend.flush();

        equal(result.foo, response.foo, 'assert correct method used to save');

    });
})();