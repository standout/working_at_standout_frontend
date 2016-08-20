$(".editform").submit(function (event) {
    event.preventDefault();
});
function getCoords() {
    var url = "https://maps.googleapis.com/maps/api/geocode/json";
    url += "?address=" + $("#formLocation").val();
    url += "&key=AIzaSyDCTM-wlTR7UCPY9kOXVvH-Hh04ldrPo4U";
    $.get(url, function (response) {
        var location = response.results[0].geometry.location;
        $("#formLatitudeOut").val(location.lat);
        $("#formLongitudeOut").val(location.lng);
    });
}
function markLocation() {
    addMarkers([{
            name: $("#formLocation").val(),
            latitude: $("#formLatitudeOut").val(),
            longitude: $("#formLongitudeOut").val()
        }]);
    map.setZoom(15); //Don't be right up in it's face
}
function getInput() {
    return {
        id: $("#formId").val(),
        name: $("#formName").val(),
        phone: $("#formPhone").val(),
        address: $("#formAddress").val(),
        latitude: $("#formLatitude").val(),
        longitude: $("#formLongitude").val(),
        category: $("#formCategory").val(),
        other: $("#formOther").val()
    };
}
function getCatInput() {
    return {
        id: $("#formIdCat").val(),
        name: $("#formNameCat").val()
    };
}
function clearForm() {
    $("#formId, #formIdCat").val(0);
    $("#formName, #formPhone, #formAddress, #formLatitude, #formLongitude, #formOther, #formNameCat").val("");
}
function sendLocation(method, input) {
    var deferred = $.Deferred();
    if (method === "delete" && input.id > 0) {
        deleteLocation(input.id).done(function (response) {
            deferred.resolve("Location Deleted.", response);
        }).fail(function (response) {
            deferred.reject("API Error", response);
        });
    } else if ((method === "add" || method === "update")
            && input.name.length
            && input.latitude > 0
            && input.longitude > 0
            && input.address.length
            && input.category > 0) {
        if (method === "add") {
            //Check for duplicates (name or lat/lng)
            if (locations.filter(function (loc) {
                return loc.name == input.name ||
                        (loc.latitude == input.latitude &&
                                loc.longitude == input.longitude);
            }).length > 0) {
                deferred.reject("Duplicate Location");
            } else {
                input.id = 0;
                addLocation(input).done(function (response) {
                    deferred.resolve("Location Added.", response);
                }).fail(function (response) {
                    deferred.reject("API Error", response);
                });
            }
        } else if (input.id > 0) {
            //Check other locations for duplicates (name or lat/lng)
            if (locations.filter(function (loc) {
                return loc.id != input.id && (loc.name == input.name ||
                        (loc.latitude == input.latitude &&
                                loc.longitude == input.longitude));
            }).length > 0) {
                deferred.reject("Duplicate Location");
            } else {
                updateLocation(input).done(function (response) {
                    deferred.resolve("Location Updated.", response);
                }).fail(function (response) {
                    deferred.reject("API Error", response);
                });
            }
        } else {
            deferred.reject("Bad Input");
        }
    } else {
        deferred.reject("Bad Input");
    }
    return deferred.promise();
}
function sendCategory(method, input) {
    var deferred = $.Deferred();
    if (method === "delete" && input.id > 0) {
        deleteCategory(input.id).done(function (response) {
            deferred.resolve("Category Deleted.", response);
        }).fail(function (response) {
            deferred.reject("API Error", response);
        });
    } else if ((method === "add" || method === "update")
            && input.name.length) {
        //Check for duplicates
        if (categories.filter(function (cat) {
            return cat.name == input.name;
        }).length > 0) {
            deferred.reject("Duplicate Category");
        } else if (method === "add") {
            input.id = 0;
            addCategory(input).done(function (response) {
                deferred.resolve("Category Added.", response);
            }).fail(function (response) {
                deferred.reject("API Error", response);
            });
        } else if (input.id > 0) {
            updateCategory(input).done(function (response) {
                deferred.resolve("Category Updated.", response);
            }).fail(function (response) {
                deferred.reject("API Error", response);
            });
        } else {
            deferred.reject("Bad Input");
        }
    } else {
        deferred.reject("Bad Input");
    }
    return deferred.promise();
}
function sendForm(type, method) {
    if (type === "category") {
        var input = getCatInput();
        sendCategory(method, input).done(function () {
            clearForm();
            refreshData();
        }).fail(function (msg) {
            alert(msg);
        });
    } else if (type === "location") {
        var input = getInput();
        sendLocation(method, input).done(function () {
            clearForm();
            refreshData();
        }).fail(function (msg) {
            alert(msg);
        });
    }
}

//Checks for numbers and decimal symbol
function isNumberKey(evt)
{
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode != 46 && charCode > 31
            && (charCode < 48 || charCode > 57))
        return false;

    return true;
}