angular.module('Standout')
.controller('supplierController', ['$scope', '$rootScope', '$location', '$mdToast', '$mdDialog', '$http','Supplier',
function($scope, $rootScope, $location, $mdToast, $mdDialog, $http, Supplier) {
    $rootScope.supplier = Array();

    $rootScope.supplierTypes = ['Eggs', 'Bread', 'Drinks', 'Fruits', 'Meat'];
    //onload
    $scope.$on('$viewContentLoaded', function() {
        initSupplier();
    });

    $scope.updateSupplier = () => {
       const supplier = new Supplier();
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
            console.log(supplier);
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
