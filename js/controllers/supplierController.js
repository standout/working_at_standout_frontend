angular.module('Standout')
.controller('supplierController', ['$scope', '$rootScope', '$location', '$mdToast', '$mdDialog', '$http', 'Supplier','Map',
function($scope, $rootScope, $location, $mdToast, $mdDialog, $http, Supplier, Map) {

    $scope.allSuppliers = Array();
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

    var initMap = () => {
        const map = new Map();
        map.createMap();
        map.addMarkersInTheMap($scope.allSuppliers);
    }

    $scope.selectTab = (tab) => {
        if (tab == 'map') {
            //when the MAP tab is clicked
            initMap();
        }
    }

}])