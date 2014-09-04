angular.module('css.controllers', ['css.services'])

.controller('IndexCtrl', function($scope) {})

.controller('LoginCtrl', function($scope) {})

.controller('ReviewCtrl', function($scope, $stateParams, $state, BasicMgr) {
    console.log($stateParams.reviewId);

    $scope.shouldHideSubitems = {};

    BasicMgr.getReview("unit_1", "2014-08", "1").then(function(data) {
        console.log(data);
        $scope.data = data;
    });

    $scope.toggle = function(target, index, item) {
        if ($scope.shouldHideSubitems[item.index] === undefined) {
            $scope.shouldHideSubitems[item.index] = true;
        } else {
            $scope.shouldHideSubitems[item.index] = !$scope.shouldHideSubitems[item.index];
        }
    }
})

.filter('rotate', function() {
    return function (input) {
        console.log(input);
        if (input) {
            return '0deg';
        }

        return '90deg';
    };
})

.controller('ContactCtrl', function($scope, $stateParams) {
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
})

.controller('BuilderIndexCtrl', function($scope, $state) {
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
})

.controller('FriendsCtrl', function($scope, Friends) {
    $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
    $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {});