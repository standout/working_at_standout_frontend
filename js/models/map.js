'use strict';
angular.module('Standout')
.factory('Map', ['$http', 'Config', function($http, Config) {

    class Map 
    {
        /**
         * constructor - the map constructor
         */
        constructor() {
            this.map
        }

        /**
         * createMap - creates the map in the given div
         */
        createMap(lon = 56.8833333, lat = 14.8166667, zoom = 10, dom = 'map') {
            this.lon = lon;
            this.lat = lat;
            this.zoom = 10;
            this.divMap = document.getElementById(dom);

            this.map = new google.maps.Map(this.divMap, {
                center: {lat: this.lon, lng: this.lat},
                zoom: this.zoom
            });
        }

        /**
         * addMarkersInTheMap - adds the given suppliers into the map
         * @param suppliers {Array} an array of supplier objects
         */
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

        /**
         * getCoordinatesForAddress - returns the coordinates of the given address
         * @param {String} theAddress
         * @return {Object} coordinates - contains longitude and latitude
         */
        getCoordinatesForAddress(theAddress, callback) {
            var geocoder = new google.maps.Geocoder();
            const address = decodeURIComponent(escape(theAddress));
            geocoder.geocode({'address': address}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var location = results[0].geometry.location;
                    var coordinates = {status : 'found', latitude : location.lat(), longitude : location.lng()};
                    return callback(coordinates);
                }
                else {
                    return callback({status : 'not_found'});
                }
            });
        }

    }

    return Map;
}])