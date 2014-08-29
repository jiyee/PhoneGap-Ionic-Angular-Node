angular.module('css.controllers', [])

.controller('IndexCtrl', function($scope) {
})

.controller('LoginCtrl', function($scope) {
})

.controller('BuilderIndexCtrl', function($scope) {
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
});
