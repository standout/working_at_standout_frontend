angular.module('Standout')
.controller('supplierController', ['$scope', '$rootScope', '$location', '$mdToast', '$mdDialog', '$http','Supplier','Map',
function($scope, $rootScope, $location, $mdToast, $mdDialog, $http, Supplier, Map) {
    /**
     * supplier - variable that holds the supplier object
     */
    $rootScope.supplier = Array();

    /**
     * supplierTypes - is an array with the supplier types
     */
    $rootScope.supplierTypes = ['Eggs', 'Bread', 'Drinks', 'Fruits', 'Meat'];
    
    /**
     * when the page loads ..
     */
    $scope.$on('$viewContentLoaded', function() {
        initSupplier();
    });

    /**
     * updateSupplier - this function is called when update button is clicked
     * @return void
     */
    $scope.updateSupplier = () => {
       const supplier = new Supplier();
       const map = new Map();
       //we have to also update the coordinates therefore we 
       //have to check the address once more and update its coordinates
       map.getCoordinatesForAddress($rootScope.supplier.address, function(coordinates) {
            //append the coordinates to the newSupplier object
            if (coordinates.status === 'found') {
                $rootScope.supplier['longitude'] = coordinates.longitude;
                $rootScope.supplier['latitude'] = coordinates.latitude;

                supplier.updateSupplier($rootScope.supplier, function(status) {
                    if (status == 200) {
                        //the update was successful
                        $mdToast.show($mdToast.simple().content("SUPPLIER UPDATED SUCCESFULLY"));
                        $location.path("/#");
                    }
                    else {
                        //the update went wrong
                        $mdToast.show($mdToast.simple().content("SOMETHING WENT WRONG!"));
                    }
                });
            }
            else {
                $mdToast.show($mdToast.simple().content("ADDRESS WAS WRONG!"));
                $rootScope.supplier.address = ""; //empty out the address
            }
       });
       
    }

    /**
     * deleteSupplier - the function is called when delete button is clicked
     */
    $scope.deleteSupplier = (supplierID) => {
        const supplier = new Supplier();
        supplier.deleteSupplier(supplierID, function(status) {
            if (status == 200) {
                //the delete was successful
                $mdToast.show($mdToast.simple().content("SUPPLIER DELETED SUCCESFULLY"));
                $location.path("/#");
            }
            else {
                //the delete went wrong
                $mdToast.show($mdToast.simple().content("SOMETHING WENT WRONG!"));
            }
        });
    }

    /**
     * initSUpplier - gets the supplier from our API
     * @return void
     */
    initSupplier = () => {
        const supplier = new Supplier();
        supplier.getSupplierWithID(getSupplierID(), function(supplier) {
            $rootScope.supplier = supplier;
        });
    }

    /**
     * getSupplierID - reads the ID of the selected supplier from the URL
     * @return {String} ID
     */
    getSupplierID = () => {
        var paramValue = $location.path();
        var res = paramValue.split("/");
        return res[2];
    }

}])
