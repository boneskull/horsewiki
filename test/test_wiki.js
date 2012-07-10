/*global module, test, ok, strictEqual, equal, angular, COUCHDB_URL*/
(function () {
    'use strict';

    var injector = angular.injector(['ng', 'ngMock', 'wiki']);
    function getService(service) {
        return injector.get(service);
    }

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

    test('UniqueIdentifier', 1, function() {
        var output = getService('UniqueIdentifier')();
        var regex = /.{8}-.{4}-.{4}-.{4}-.{12}/;

        ok(output.match(regex), 'assert UniqueIdentifier outputs an id');
    });

    test('Page', 2, function() {
        var Page = getService('Page');
        var id = 'Foo';
        var title = 'Foo';
        var createdon = Date.now();
        var response = {foo: 'bar'};
        var $httpBackend = getService('$httpBackend');

        $httpBackend.expect('PUT', COUCHDB_URL + '/' + id, {title: title, createdon: createdon}).respond(200, response);

        var page = Page.create({id: id}, {title: title, createdon: createdon});

        $httpBackend.flush();

        equal(page.foo, response.foo, 'assert correct method used to create');

        $httpBackend.expect('PUT', COUCHDB_URL + '/' + id, {title: title, createdon: createdon}).respond(200, response);

        var result = Page.save({id: id}, {title: title, createdon: createdon});

        equal(result.title, title, 'assert correct method used to save');

    });
})();