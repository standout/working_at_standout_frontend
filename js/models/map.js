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
         * @param {Float} lon - longitude the default is 56.8833333
         * @param {Float} lat - latitude the default is 14.8166667
         * @param {Integer} zoom - the zoom factor default is 10
         * @param {DOM} dom - is the DOM element where we will attach the map
         * @return void
         */
        createMap(lon = 56.8833333, lat = 14.8166667, zoom = 10, dom = 'map') {
            this.lon = lon;
            this.lat = lat;
            this.zoom = zoom;
            this.divMap = document.getElementById(dom);

            this.map = new google.maps.Map(this.divMap, {
                center: {lat: this.lon, lng: this.lat},
                zoom: this.zoom
            });
        }

        /**
         * addMarkersInTheMap - adds the given suppliers into the map
         * @param suppliers {Array} an array of supplier objects
         * @return void
         */
        addMarkersInTheMap(suppliers) {
            for (let supplier of suppliers) {
                const marker = new google.maps.Marker({
                    position: {lat: parseFloat(supplier.latitude), lng: parseFloat(supplier.longitude)},
                    map: this.map
                });
                //add Info window to the marker that will show up when clicked
                const infowindow = new google.maps.InfoWindow();
                const contents = `<span class = "md-subhead">${supplier.name}</span><br />
                                  <span class = "md-body">${supplier.type}</span><br />
                                  <span class = "md-body">${supplier.address}</span>`;

                google.maps.event.addListener(marker,'click', (function(marker, content, infowindow){ 
                    return function() {
                        infowindow.setContent(contents);
                        infowindow.open(map, marker);
                    };
                })(marker, content, infowindow));  
            }
        }

        /**
         * getCoordinatesForAddress - returns the coordinates of the given address
         * @param {String} theAddress
         * @return {Object} coordinates - contains longitude and latitude
         */
        getCoordinatesForAddress(theAddress, callback) {
            const geocoder = new google.maps.Geocoder();
            const address = decodeURIComponent(escape(theAddress));
            console.log(address);
            geocoder.geocode({'address': address}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    const location = results[0].geometry.location;
                    const coordinates = {status : 'found', latitude : location.lat(), longitude : location.lng()};
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