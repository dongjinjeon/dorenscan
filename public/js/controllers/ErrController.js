angular.module('BlocksApp').controller('ErrController', function ($stateParams, $rootScope, $scope, $http, $location) {

  // $rootScope.$state.current.data["pageSubTitle"] = $stateParams.hash;
  $rootScope.isHome = false;
  $scope.thing = $stateParams.thing;
  $scope.hash = $stateParams.hash;
  $scope.settings = $rootScope.setup;

  const filters = [
    'addr',
    'tx',
    'block',
  ];

  if (!filters.includes($scope.thing)) $location.path("/err404");
});