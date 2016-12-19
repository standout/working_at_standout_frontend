angular.module('Standout')
.controller('supplierController', ['$scope', '$rootScope', '$location', '$mdToast', '$mdDialog', '$http','Supplier',
function($scope, $rootScope, $location, $mdToast, $mdDialog, $http, Supplier) {
    $rootScope.supplier = Array();

    $rootScope.supplierTypes = ['Eggs', 'Bread', 'Drinks', 'Fruits', 'Meat'];
    //onload
    $scope.$on('$viewContentLoaded', function() {
        initSupplier();
    });

    $scope.updateSupplier = (supplierID) => {
        alert('udpating this supplier :' + supplierID);
    }

    $scope.deleteSupplier = (supplierID) => {
        const supplier = new Supplier();
        supplier.deleteSupplier(supplierID, function(status) {
            if (status == 200) {
                //the delete was successful
                $mdToast.show($mdToast.simple().content("SUPPLIER DELETED SUCCESFULLY"));
                $location.path("/#"); //go back to the suppliers view
            }
            else {
                //the delete was successful
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
