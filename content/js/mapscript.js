var locations = [
    {
        "name": "Kalles livs",
        "latitude": 56.8790,
        "longitude": 14.8059
    },
    {
        "name": "Konsum fjollträsk",
        "latitude": 56.8740,
        "longitude": 14.8049
    }
];
function initMap() {

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
                infowindow.setContent(locations[i].name);
                infowindow.open(map, marker);
            }
        })(marker, i));
        map.fitBounds(bounds);

        var listener = google.maps.event.addListener(map, "idle", function () {
            google.maps.event.removeListener(listener);
        });
    }
}