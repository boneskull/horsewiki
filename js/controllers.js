/*global angular, console, $*/

(function () {
    'use strict';

    var APP_NAME = 'HorseWiki';
    var APP_VERSION = 0.1;

    window.PageCtrl = function ($scope, $routeParams, $location, Page, OldPage, Changes, UniqueIdentifier) {

        function setActive() {
            $scope.$parent.active = {
                home: angular.isDefined($scope.page) && $scope.page._id === 'Home' ? 'active' : '',
                about: angular.isDefined($scope.page) && $scope.page._id === 'About' ? 'active' : '',
                contact: angular.isDefined($scope.page) && $scope.page._id === 'Contact' ? 'active' : ''
            };
        }

        function getChanges() {
            Changes.findInitialSeq(function (seq) {
                Changes.getChanges(function (res) {
                    angular.forEach(res.results, function (result) {
                        if (result.id === $scope.page._id) {
                            var change = result.changes[result.changes.length - 1];
                            var currentRevNo = $scope.page._rev.split('-')[0];
                            var revNo = change.rev.split('-')[0];
                            if (revNo > currentRevNo) {
                                // we do not need to update the parent scope because the parent scope
                                // only cares about the title, which is immutable.
                                if ($scope.editing || $scope.conflict) {
                                    $scope.conflict = true;
                                    $scope.conflictingRevision = change.rev;
                                } else {
                                    $scope.page = Page.get({id: $scope.page._id, rev: change.rev});
                                }
                            }
                            return false;
                        }
                    });
                }, seq);
            });
        }

        function findRevisions() {
            var attachments = $scope.page._attachments;
            if (angular.isDefined(attachments)) {
                $scope.revs = [];
                angular.forEach(attachments, function (attachment, rev) {
                    $scope.revs.push(rev);
                });
                $scope.revs.sort();
                $scope.selectedRevision = $scope.revs[0];
            }
        }

        $scope.app_name = APP_NAME;
        $scope.app_version = APP_VERSION;
        $scope.edit = {};
        $scope.conflict = false;
        $scope.editing = false;

        var id = $routeParams.pageId;
        if (angular.isDefined($routeParams.rev)) {
            $scope.rev = $routeParams.rev;
        }

        // try to get the current page.  if we can't, create it!
        if (angular.isDefined(id)) {
            if (angular.isDefined($scope.rev)) {
                $scope.page = $scope.$parent.page = OldPage.get({id: id, rev: $scope.rev}, function() {
                    setActive();
                    findRevisions();
                });
            }
            else {
                $scope.page = $scope.$parent.page = Page.get({id: id}, function (page) {
                    setActive();
                    getChanges();
                    findRevisions();
                    $scope.previousPage = angular.copy(page);
                }, function () {
                    Page.create({id: id}, {title: id, createdon: Date.now()}, function (res) {
                        $scope.page = $scope.$parent.page = {_id: id, title: id, _rev: res.rev};
                        setActive();
                        getChanges();
                        $scope.previousPage = angular.copy($scope.page);
                    });
                });
            }
        }

        $scope.enableEditor = function (id) {
            if (angular.isUndefined($scope.rev)) {
                $scope.edit[id] = $scope.editing = true;
            }
        };

        $scope.disableEditor = function (id) {
            $scope.edit[id] = $scope.editing = false;
        };

        $scope.addParagraph = function () {

            if (!angular.isArray($scope.page.data)) {
                $scope.page.data = [];
            }

            $scope.page.data.push({
                text: 'Insert text here.',
                id: UniqueIdentifier()
            });

            Page.save($scope.page, function (res) {
                $scope.page._rev = res.rev;
            });
        };

        $scope.keep = function () {
            $scope.page._rev = $scope.conflictingRevision;
            Page.save($scope.page, function (res) {
                $scope.page._rev = res.rev;
                $scope.conflict = false;
                delete $scope.conflictingRevision;
            });
        };

        $scope.discard = function () {
            $scope.page = Page.get({id: $scope.page._id, rev: $scope.conflictingRevision}, function () {
                $scope.conflict = false;
                delete $scope.conflictingRevision;
            });
        };

        /**
         * for debugging purposes
         */
        $scope.createConflict = function () {
            $scope.conflict = true;
            var page = {
                _id: $scope.page._id,
                title: $scope.page._id,
                data: angular.copy($scope.page.data),
                _rev: $scope.page._rev
            };
            page.data.push({
                text: 'Conflicting paragraph',
                id: UniqueIdentifier()
            });
            Page.save(page, function (res) {
                $scope.conflictingRevision = res.rev;
            });
        };

        $scope.viewRevision = function () {
            $location.url('/' + $scope.page._id + '/rev/' + $scope.selectedRevision);
        };
    };
    window.PageCtrl.$inject = ['$scope', '$routeParams', '$location', 'Page', 'OldPage', 'Changes', 'UniqueIdentifier'];


})();