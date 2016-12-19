var app = angular.module('Standout', ['ui.router', 'ngMaterial', 'ngMdIcons'])
.config(function($urlRouterProvider, $stateProvider, $mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue-grey')
    .accentPalette('teal');
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('home', {
          url:'/',
          templateUrl:'templates/home.html',
          controller: 'suppliersController'
      })
      .state('supplier', {
          url:'/supplier/:name',
          templateUrl:'templates/supplier.html',
          controller: 'supplierController'
      })

});

app.controller('AppCtrl', ['$scope','$rootScope','$location', function($scope, $rootScope, $location){

}]);
