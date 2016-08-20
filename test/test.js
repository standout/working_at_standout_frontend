describe('DB API', function () {
    beforeEach(function (done) {
        //A bit of delay between tests so the server can keep up
        setTimeout(function () {
            done();
        }, 50);
    });
    describe('Locations', function () {
        var oName, oLat, oLng;
        var fakeLatLng = 10;
        var fakeName = "DupeCheck";
        describe('get', function () {
            it('should get all locations', function (done) {
                getLocations().done(function (data) {
                    locations = data;
                    //Add a fake location for duplicate checking
                    locations.push({
                        "id": 1337,
                        "name": fakeName,
                        "phone": "000-0000000",
                        "address": "Bbbbbb 2",
                        "latitude": fakeLatLng,
                        "longitude": fakeLatLng,
                        "category": 1,
                        "other": ""
                    });
                }).always(function () {
                    done();
                });
            });
        });
        var input = {
            "id": 0,
            "name": "Mocha Test",
            "phone": "076-1122334",
            "address": "Mochavägen 2",
            "latitude": 56.8765,
            "longitude": 14.8049,
            "category": 1,
            "other": "Added by Mocha JS"
        };
        describe('post', function () {
            var method = "add";
            it('should add a new location', function (done) {
                sendLocation(method, input).done(function (msg, response) {
                    $.extend(input, response);
                    locations.push(response);
                    oName = input.name;
                    oLat = input.latitude;
                    oLng = input.longitude;
                    assert.ok(response.name === input.name);
                }).fail(function (msg) {
                    assert.fail(msg);
                }).always(function () {
                    done();
                });
            });
            it('should fail on duplicate location name', function (done) {
                input.name = fakeName;
                sendLocation(method, input).done(function (msg, response) {
                    assert.fail(msg);
                }).always(function () {
                    input.name = oName;
                    input.latitude = oLat;
                    input.longitude = oLng;
                    done();
                });
            });
            it('should fail on duplicate location coordinates', function (done) {
                input.latitude = fakeLatLng;
                input.longitude = fakeLatLng;
                sendLocation(method, input).done(function (msg, response) {
                    assert.fail(msg);
                }).always(function () {
                    input.name = oName;
                    input.latitude = oLat;
                    input.longitude = oLng;
                    done();
                });
            });
            it('should fail on empty name', function (done) {
                input.name = "";
                sendLocation(method, input).done(function (msg, response) {
                    assert.fail(msg);
                }).always(function () {
                    done();
                });
            });
        });
        describe('put', function () {
            var method = "update";
            it('should update a location in the database', function (done) {
                input.name = "Mocha Updated Test";
                sendLocation(method, input).done(function (msg, response) {
                    $.extend(input, response);
                    $.extend(locations[locations.length - 1], response);
                    oName = input.name;
                    oLat = input.latitude;
                    oLng = input.longitude;
                    assert.ok(response.name === input.name);
                }).fail(function (msg) {
                    assert.fail(msg);
                }).always(function () {
                    done();
                });
            });
            it('should fail on duplicate location name', function (done) {
                input.name = fakeName;
                sendLocation(method, input).done(function (msg, response) {
                    assert.fail(msg);
                }).always(function () {
                    input.name = oName;
                    input.latitude = oLat;
                    input.longitude = oLng;
                    done();
                });
            });
            it('should fail on duplicate location coordinates', function (done) {
                input.latitude = fakeLatLng;
                input.longitude = fakeLatLng;
                sendLocation(method, input).done(function (msg, response) {
                    assert.fail(msg);
                }).always(function () {
                    input.name = oName;
                    input.latitude = oLat;
                    input.longitude = oLng;
                    done();
                });
            });
            it('should fail on empty name', function (done) {
                input.name = "";
                sendLocation(method, input).done(function (msg, response) {
                    assert.fail(msg);
                }).always(function () {
                    done();
                });
            });
        });
        var method = "delete";
        describe('delete', function () {
            it('should delete a location from the database', function (done) {
                sendLocation(method, input).fail(function (msg) {
                    assert.fail(msg);
                }).always(function () {
                    done();
                });
            });
            it('should fail on bad id', function (done) {
                sendCategory(method, 0).done(function (msg) {
                    assert.fail(msg);
                }).always(function () {
                    done();
                });
            });
        });
    });
    describe('Categories', function () {
        describe('get', function () {
            it('should get all categories', function (done) {
                getCategories().done(function (data) {
                    categories = data;
                }).fail(function () {
                    assert.fail();
                }).always(function () {
                    done();
                });
            });
        });
        var input = {};
        describe('post', function () {
            var method = "add";
            it('should add a new category', function (done) {
                input.name = "Mocha Test";
                sendCategory(method, input).done(function (msg, response) {
                    assert.ok(response.name === input.name);
                    $.extend(input, response);
                    categories.push(response);
                }).fail(function (msg) {
                    assert.fail(msg);
                }).always(function () {
                    done();
                });
            });
            it('should fail on duplicate category', function (done) {
                sendCategory(method, input).done(function (msg, response) {
                    assert.fail(msg);
                }).always(function () {
                    done();
                });
            });
            it('should fail on empty name', function (done) {
                input.name = "";
                sendCategory(method, input).done(function (msg, response) {
                    assert.fail(msg);
                }).always(function () {
                    done();
                });
            });
        });
        describe('put', function () {
            var method = "update";
            it('should update a location in the database', function (done) {
                input.name = "Mocha Updated Test";
                sendCategory(method, input).done(function (msg, response) {
                    assert.ok(response.name === input.name);
                    $.extend(input, response);
                    $.extend(categories[categories.length - 1], response);
                }).fail(function (msg) {
                    assert.fail(msg);
                }).always(function () {
                    done();
                });
            });
            it('should fail on duplicate category', function (done) {
                sendCategory(method, input).done(function (msg, response) {
                    assert.fail(msg);
                }).always(function () {
                    done();
                });
            });
            it('should fail on empty name', function (done) {
                input.name = "";
                sendCategory(method, input).done(function (msg, response) {
                    assert.fail(msg);
                }).always(function () {
                    done();
                });
            });
        });
        describe('delete', function () {
            var method = "delete";
            it('should delete a location from the database', function (done) {
                sendCategory(method, input).fail(function (msg) {
                    assert.fail(msg);
                }).always(function () {
                    done();
                });
            });
            it('should fail on bad id', function (done) {
                sendCategory(method, 0).done(function (msg) {
                    assert.fail(msg);
                }).always(function () {
                    done();
                });
            });
        });
    });
});