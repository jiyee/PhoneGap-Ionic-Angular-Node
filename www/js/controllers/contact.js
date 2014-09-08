app.controller('ContactCtrl', function($scope, $stateParams) {
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
    });
