angular.module('Standout')
.controller('supplierController', ['$scope', '$rootScope', '$location', '$mdToast', '$mdDialog', '$http', 'Supplier','Map',
function($scope, $rootScope, $location, $mdToast, $mdDialog, $http, Supplier, Map) {

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
        });
    }

    var initMap = () => {
        const map = new Map();
        map.createMap();
        map.addMarkersInTheMap($scope.allSuppliers);
        /*
        var myMap = document.getElementById('map');
        var map = new google.maps.Map(myMap, {
            center: {lat: 56.8833333, lng: 14.8166667},
            zoom: 6
        });*/
    }

    $scope.selectTab = (tab) => {
        if (tab == 'map') {
            initMap();
        }
    }

}])