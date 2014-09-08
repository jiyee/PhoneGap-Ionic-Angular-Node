var app = angular.module('app', ['ionic']);

app.run(["$ionicPlatform", function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.hide();
        }
    });
}])

.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {

    // 条件路由
    $stateProvider

    // 首页，用户类型
    .state('welcome', {
        url: '/welcome',
        templateUrl: 'templates/welcome.html',
        controller: 'WelcomeCtrl'
    })

    // 用户登录
    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
    })

    // 用户联系方式
    .state('contact', {
        url: "/contact/:userId",
        templateUrl: "templates/contact.html",
        controller: 'ContactCtrl',
    })

    // 考核列表页
    .state('review', {
        url: "/review/:reviewId",
        templateUrl: "templates/review.html",
        controller: 'ReviewCtrl',
    })

    // 建设单位首页
    .state('builder/index', {
        url: '/builder/index',
        templateUrl: 'templates/builder/index.html',
        controller: 'BuilderIndexCtrl'
    })

    // setup an abstract state for the tabs directive
    .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.dash', {
        url: '/dash',
        views: {
            'tab-dash': {
                templateUrl: 'templates/tab-dash.html',
                controller: 'DashCtrl'
            }
        }
    })

    .state('tab.friends', {
        url: '/friends',
        views: {
            'tab-friends': {
                templateUrl: 'templates/tab-friends.html',
                controller: 'FriendsCtrl'
            }
        }
    })

    .state('tab.friend-detail', {
        url: '/friend/:friendId',
        views: {
            'tab-friends': {
                templateUrl: 'templates/friend-detail.html',
                controller: 'FriendDetailCtrl'
            }
        }
    })

    .state('tab.account', {
        url: '/account',
        views: {
            'tab-account': {
                templateUrl: 'templates/tab-account.html',
                controller: 'AccountCtrl'
            }
        }
    });

    // 设置默认路由
    $urlRouterProvider.otherwise('builder/index');
    // $urlRouterProvider.otherwise('welcome');

}]);

app.controller('ContactCtrl', ["$scope", "$stateParams", function($scope, $stateParams) {
        var list = [{
            name: '蹇元平',
            tel: '027-56881234',
            mobile: '13589337688'
        }, {
            name: '龙海生',
            tel: '027-56881234',
            mobile: '13589337688'
        }, {
            name: '何红民',
            tel: '027-56881234',
            mobile: '13589337688'
        }];

        var user = list[$stateParams.userId];

        $scope.name = user.name;
        $scope.tel = user.tel;
        $scope.mobile = user.mobile;
    }]);

app.controller('LoginCtrl', ["$scope", function($scope) {

    }]);

app.controller('ReviewCtrl', ["$scope", "$stateParams", "$state", "BasicMgrService", function($scope, $stateParams, $state, BasicMgrService) {
        console.log($stateParams.reviewId);

        $scope.shouldHideSubitems = {};

        BasicMgrService.getReview("unit_1", "2014-08", "1").then(function(data) {
            console.log(data);
            $scope.data = data;
        });

        $scope.toggle = function(target, index, item) {
            if ($scope.shouldHideSubitems[item.index] === undefined) {
                $scope.shouldHideSubitems[item.index] = true;
            } else {
                $scope.shouldHideSubitems[item.index] = !$scope.shouldHideSubitems[item.index];
            }
        };
    }]);

app.controller('WelcomeCtrl', ["$scope", function($scope) {

    }]);

app.filter('rotate', function() {
    return function(input) {
        console.log(input);
        if (input) {
            return '0deg';
        }

        return '90deg';
    };
});

app.factory('BasicMgrService', ["$http", "$q", "$timeout", function($http, $q, $timeout) {

    var uniqueKey = "basic_mgr";

    function validate(unitId, reviewDate, reviewType) {
        console.log(unitId, reviewDate, reviewType);

        if (!unitId || !reviewDate || !reviewType) return false;
        if (!/\d{4}-\d{2}/.test(reviewDate) || !/(1|2)/.test(reviewType)) return false;

        return true;
    }

    return {
        createReview: function(unitId, reviewDate, reviewType) {
            var deferred = $q.defer();

            if (!validate(unitId, reviewDate, reviewType)) {
                $timeout(function() {
                    deferred.reject("arguments error");
                }, 0);

                return deferred.promise;
            }

            var reviewId = [uniqueKey, unitId, reviewDate, reviewType].join("_");

            $http.get('data/review_table_3.json').success(function(data) {
                angular.extend(data, {
                    under_review_unit_id: unitId,
                    review_date: reviewDate,
                    review_type: reviewType
                });

                deferred.resolve(data);
            });

            return deferred.promise;
        },

        getReview: function(unitId, reviewDate, reviewType) {
            var deferred = $q.defer();

            if (!validate(unitId, reviewDate, reviewType)) {
                $timeout(function() {
                    deferred.reject("arguments error");
                }, 0);

                return deferred.promise;
            }

            var reviewId = [uniqueKey, unitId, reviewDate, reviewType].join("_");

            var data = localStorage.getItem(reviewId);
            if (data) {
                try {
                    data = JSON.parse(data);
                } catch (ex) {
                    this.createReview(unitId, reviewDate, reviewType).then(function(data) {
                        localStorage.setItem(reviewId, JSON.stringify(data));
                        deferred.resolve(data);
                    });
                }

                deferred.resolve(data);
            } else {
                this.createReview(unitId, reviewDate, reviewType).then(function(data) {
                    localStorage.setItem(reviewId, JSON.stringify(data));
                    deferred.resolve(data);
                });
            }

            return deferred.promise;
        },

        setReview: function(unitId, reviewDate, reviewType, reviewData) {
            var deferred = $q.defer();

            if (!validate(unitId, reviewDate, reviewType)) {
                $timeout(function() {
                    deferred.reject("arguments error");
                }, 0);

                return deferred.promise;
            }
            var reviewId = [uniqueKey, unitId, reviewDate, reviewType].join("_");

            angular.forEach(reviewData.items, function(level1) {
                var status2 = 0;
                angular.forEach(level1.items, function(level2) {
                    var status3 = 0;
                    angular.forEach(level2.items, function(level3) {
                        status3 += level3.status;
                    });

                    if (status3 === level2.items.length) {
                        level2.status = 1;
                    } else {
                        level2.status = 0;
                    }

                    status2 += level2.status;
                });

                if (status2 === level1.items.length) {
                    level1.status = 1;
                } else {
                    level1.status = 0;
                }
            });

            localStorage.setItem(reviewId, JSON.stringify(data));

            $timeout(function() {
                deferred.resolve();
            });

            return deferred.promise;
        },

        getScore: function(unitId, reviewDate, reviewType) {
            var deferred = $q.defer();

            if (!validate(unitId, reviewDate, reviewType)) {
                $timeout(function() {
                    deferred.reject("arguments error");
                }, 0);

                return deferred.promise;
            }
            var reviewId = [uniqueKey, unitId, reviewDate, reviewType].join("_");

            var data = localStorage.getItem(reviewId);
            var score = 0,
                total = 0;
            if (data) {
                try {
                    data = JSON.parse(data);
                } catch (ex) {
                    $timeout(function() {
                        deferred.reject("data parse error");
                    }, 0);

                    return deferred.promise;
                }

                angular.forEach(data.items, function(level1) {
                    angular.forEach(level1.items, function(level2) {
                        angular.forEach(level2.items, function(level3) {
                            if (level3.status) {
                                total += level2.total;
                                score += level3.score;
                            }
                        });
                    });
                });
            }

            $timeout(function() {
                deferred.resolve({
                    total: total,
                    score: score,
                    final: total === 0 ? 0 : Math.floor((total - score) / total * 10000) / 100
                });
            }, 0);

            return deferred.promise;
        },

        getRect: function(unitId, reviewDate, reviewType) {
            var deferred = $q.defer();

            if (!validate(unitId, reviewDate, reviewType)) {
                $timeout(function() {
                    deferred.reject("arguments error");
                }, 0);

                return deferred.promise;
            }

            var reviewId = [uniqueKey, unitId, reviewDate, reviewType].join("_");

            var data = localStorage.getItem(reviewId);
            var ret = [];
            if (data) {
                try {
                    data = JSON.parse(data);
                } catch (ex) {
                    $timeout(function() {
                        deferred.reject("data parse error");
                    }, 0);

                    return deferred.promise;
                }

                angular.forEach(data.items, function(level1) {
                    angular.forEach(level1.items, function(level2) {
                        angular.forEach(level2.items, function(level3) {
                            if (level3.status && level3.score > 0) {
                                ret.push({
                                    name: level3.name,
                                    images: level3.images
                                });
                            }
                        });
                    });
                });
            }

            $timeout(function() {
                deferred.resolve(ret);
            }, 0);

            return deferred.promise;
        }
    };
}]);

app.controller('BuilderIndexCtrl', ["$scope", "$state", function($scope, $state) {
    // BasicMgr.getReview("unit_1", "2014-08", "1").then(function(data) {
    // console.log(data);
    // });

    // BasicMgr.getRect("unit_1", "2014-08", "1").then(function(data) {
    //     console.log(data);
    // }, function(err){
    //     console.log(err);
    // });

    function getPaddedNumber(number) {
        if (number < 10)
            return "0" + number;
        else
            return number;
    }

    var unitId = "unit_1";
    var date = new Date();
    var currentDate = date.getFullYear() + "-" + getPaddedNumber(date.getMonth() + 1);

    $scope.toReview = function() {
        var reviewId = [unitId, currentDate, "1"].join("_");

        $state.go("review", {
            reviewId: reviewId
        });
    };

    $scope.toScore = function() {

    };

    $scope.toReport = function() {

    };
}]);
