//Adds all the locations to the ID dropdown
function populateIdSelect() {
    var options = $("#formId");
    options.find('option')
            .remove()
            .end()
            .append('<option value=0>New</option>');
    $.each(locations, function () {
        options.append($("<option />").val(this.id).text(this.id + ':' + this.name));
    });
}//Adds all the locations to the ID dropdown
function populateCatSelect() {
    var idoptions = $("#formIdCat");
    idoptions.find('option')
            .remove()
            .end()
            .append('<option value=0>New</option>');
    var catoptions = $("#formCategory");
    catoptions.find('option')
            .remove()
            .end();
    $.each(categories, function () {
        idoptions.append($("<option />").val(this.id).text(this.id + ':' + this.name));
        catoptions.append($("<option />").val(this.id).text(this.name));
    });
}
//Updates the form inputs using a new id or the currently selected id
function selectEditLocation(id) {
    if (id > -1)
        $("#formId").val(id);
    id = $("#formId").val();
    var selected = locations.filter(function (location) {
        return location.id == id;
    })[0];
    $("#formName").val(selected.name);
    $("#formPhone").val(selected.phone);
    $("#formAddress").val(selected.address);
    $("#formLatitude").val(selected.latitude);
    $("#formLongitude").val(selected.longitude);
    $("#formCategory").val(selected.category);
    $("#formOther").val(selected.other);
}
$("#formId").change(function () {
    selectEditLocation();
});
function updateMap() {
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
                selectEditLocation(locations[i].id);
            }
        })(marker, i));
        map.fitBounds(bounds);

        var listener = google.maps.event.addListener(map, "idle", function () {
            google.maps.event.removeListener(listener);
        });
    }
}
function refreshData() {
    getLocations().done(function (data) {
        locations = data;
        populateIdSelect();
        updateMap();
    });
    getCategories().done(function (data) {
        categories = data;
        populateCatSelect();
    });
}