function getLocations(callback) {
    $.get('http://' + window.location.hostname + ':3000/suppliers', function (data) {
        callback(0, data);
    }).fail(function () {
        callback("An error occured getting the locations.");
    });
}
function initMap() {
    getLocations(function (err, locations) {
        if (err)
            return console.log(err);
        var map = new google.maps.Map(document.getElementById('map'));
        var bounds = new google.maps.LatLngBounds();
        var infowindow = new google.maps.InfoWindow();

        //Create markers for each location
        for (i = 0; i < locations.length; i++) {
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(locations[i].latitude, locations[i].longitude),
                map: map
            });

            //Extend the bounds to include each marker's position
            bounds.extend(marker.position);

            //Display information for a marker when clicked
            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    infowindow.setContent("<strong>" + locations[i].name
                            + "</strong><br/> " + locations[i].other);
                    infowindow.open(map, marker);
                    //selectEditLocation(locations[i].id);
                }
            })(marker, i));
            map.fitBounds(bounds);

            var listener = google.maps.event.addListener(map, "idle", function () {
                google.maps.event.removeListener(listener);
            });
        }
    });
}