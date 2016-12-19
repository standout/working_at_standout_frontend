angular.module('Standout')
.controller('suppliersController', ['$scope', '$rootScope', '$location', '$mdToast', '$mdDialog', '$http', 'Supplier','Map',
function($scope, $rootScope, $location, $mdToast, $mdDialog, $http, Supplier, Map) {

    //$rootScope.allSuppliers = Array();
    $rootScope.supplierTypes = ['Eggs', 'Bread', 'Drinks', 'Fruits', 'Meat'];
    $scope.newSupplier = {};
    //onload
    $scope.$on('$viewContentLoaded', function() {
        initSuppliers();
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

    /**
     * initMap - initiates the map
     */
    var initMap = () => {
        const map = new Map();
        map.createMap();
        map.addMarkersInTheMap($scope.allSuppliers);
    }

    /**
     * selectTab - triggered when a tab is clicked
     */
    $scope.selectTab = (tab) => {
        if (tab == 'map') {
            //when the MAP tab is clicked then initiate the map
            initMap();
        }
    }

    /**
     * editSupplier - when Edit button in one of the suppliers is clicked
     * it redirects to the supplier view
     */
    $scope.editSupplier = (supplierName) => {
        $location.path("/supplier/" + supplierName);
    }

    /**
     * saveNewSupplier - saves the new supplier that was entered by the user
     */
    $scope.saveNewSupplier = () => {
        $scope.correctAddress = false;
        const map = new Map();
        map.getCoordinatesForAddress($scope.newSupplier.address, function(coordinates) {
            console.log(coordinates);
            if (coordinates.status === 'found') {
                //append the coordinates to the newSupplier object
                $scope.newSupplier['longitude'] = coordinates.longitude;
                $scope.newSupplier['latitude'] = coordinates.latitude;
                const newSupplier = new Supplier();
                newSupplier.storeToDB($scope.newSupplier, function(response) {
                    if (response.status == 201) {
                        //the new supplier was created successfully
                        $mdToast.show($mdToast.simple().content("SUPPLIER ADDED SUCCESFULLY"));
                        //we push the new supplier in the scope.allSuppliers
                        $scope.allSuppliers.push(response.data);
                        //redirect to the newly created supplier
                        $location.path("/supplier/" + response.data.id);
                    }
                    else {
                        $mdToast.show($mdToast.simple().content("SOMETHING WENT WRONG!"));
                    }
                })
            }
            else {
                $mdToast.show($mdToast.simple().content("ADDRESS WAS WRONG!"));
                $scope.newSupplier.address = ""; //empty out the address
            }
        });
    }

}])