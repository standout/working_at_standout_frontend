'use strict';
angular.module('Standout')
.factory('Map', ['$http', 'Config', function($http, Config) {

    class Map 
    {
        constructor(lon = 56.8833333, lat = 14.8166667) {
            this.lon = lon;
            this.lat = lat;
            this.zoom = 10;
            this.divMap = document.getElementById('map');
            this.map
        }

        createMap() {
            this.map = new google.maps.Map(this.divMap, {
                center: {lat: this.lon, lng: this.lat},
                zoom: this.zoom
            });
        }

        addMarkersInTheMap(suppliers) {
            for (let supplier of suppliers) {
                var marker = new google.maps.Marker({
                    position: {lat: parseFloat(supplier.latitude), lng: parseFloat(supplier.longitude)},
                    map: this.map
                });

                google.maps.event.addListener(marker, 'click', function () {
                    // do something with this marker ...
                    alert('marker is clicked');
                });
            }
        }

    }

    return Map;
}])