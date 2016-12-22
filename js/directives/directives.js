angular.module('Standout')
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