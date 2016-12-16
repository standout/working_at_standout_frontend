angular.module('Standout')
.controller('homeController', ['$scope', '$rootScope', '$location', '$mdToast', '$mdDialog', '$http', 'Supplier',
function($scope, $rootScope, $location, $mdToast, $mdDialog, $http, Supplier) {

    $scope.allSuppliers = Array();
    //onload
    $scope.$on('$viewContentLoaded', function() {
        init();
    });

    /**
     * init - this function is called first when the page is loaded to initiate the view
     * @return void
     */
    var init = () => {
        const suppliers = new Supplier();
        suppliers.getAllSuppliers(function(suppliers) {
            $scope.allSuppliers = suppliers;
            console.log(suppliers);
        });
    }

}])

//DIRECTIVES
.directive('suppliersView', function() {
    return {
    	restrict:'E',
    	templateUrl:'views/suppliers-view.html',
    	controller: 'suppliersController'
 	};
})
.directive('newSupplier', function() {
    return {
    	restrict:'E',
    	templateUrl:'views/new-supplier.html',
    	controller: 'newSupplierController'
 	};
})
.directive('mapView', function() {
    return {
    	restrict:'E',
    	templateUrl:'views/map-view.html',
    	controller: 'mapOverviewController'
 	};
})