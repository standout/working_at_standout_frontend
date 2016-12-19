angular.module('Standout')
.controller('suppliersController', ['$scope', '$rootScope', '$location', '$mdToast', '$mdDialog', '$http', 'Supplier','Map',
function($scope, $rootScope, $location, $mdToast, $mdDialog, $http, Supplier, Map) {

    //$rootScope.allSuppliers = Array();
    $rootScope.supplierTypes = ['Eggs', 'Bread', 'Drinks', 'Fruits', 'Meat'];
    $scope.newSupplier = {};
    //onload
    $scope.$on('$viewContentLoaded', function() {
        initSuppliers();
        console.log('this is the new supplier data');
        console.log($scope.newSupplier);
        console.log('this is the new supplier data');
    });

    /**
     * init - this function is called first when the page is loaded to initiate the view
     * @return void
     */
    var initSuppliers = () => {
        const suppliers = new Supplier();
        suppliers.getAllSuppliers(function(suppliers) {
            $scope.allSuppliers = suppliers;
        });
    }

    var initMap = () => {
        const map = new Map();
        map.createMap();
        map.addMarkersInTheMap($scope.allSuppliers);
    }

    $scope.selectTab = (tab) => {
        if (tab == 'map') {
            //when the MAP tab is clicked then initiate the map
            initMap();
        }
    }

    $scope.editSupplier = (supplierName) => {
        $location.path("/supplier/" + supplierName);
    }

    $scope.saveNewSupplier = () => {
        const newSupplier = new Supplier();
        newSupplier.storeToDB($scope.newSupplier, function(response) {
            if (response.status == 201) {
                //the new supplier was created successfully
                $mdToast.show($mdToast.simple().content("SUPPLIER ADDED SUCCESFULLY"));
                //we push the new supplier in the scope.allSuppliers
                $scope.allSuppliers.push(response.data);
                //we empty out the newSupplier scope
                $scope.newSupplier = {};
            }
        });
    }

}])