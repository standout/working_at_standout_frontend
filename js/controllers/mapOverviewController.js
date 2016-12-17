angular.module('Standout')
.controller('mapOverviewController', ['$scope', '$rootScope', '$location', '$mdToast', '$mdDialog', '$http',
function($scope, $rootScope, $location, $mdToast, $mdDialog, $http) {
    //onload
    $scope.$on('$viewContentLoaded', function() {
        alert("SHITTT..");
        initMap();
    });

    var initMap = () => {
        var map;
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 56.8833333, lng: 14.8166667},
            zoom: 6
        });
    }
}])
