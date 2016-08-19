describe('DB API', function () {
    describe('Locations', function () {
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
            it('should add a new category', function (done) {
                var method = "add";
                sendLocation(method, input).done(function (msg, response) {
                    assert.ok(response.name === input.name);
                    $.extend(input, response);
                }).fail(function (msg) {
                    assert.fail(msg);
                }).always(function () {
                    done();
                });
            });
        });
        describe('put', function () {
            var method = "update";
            input.name = "Mocha Updated Test";
            it('should update a location in the database', function (done) {
                sendLocation(method, input).done(function (msg, response) {
                    assert.ok(response.name === input.name);
                }).fail(function (msg) {
                    assert.fail(msg);
                }).always(function () {
                    done();
                });
            });
        });
        describe('delete', function () {
            it('should delete a location from the database', function (done) {
                var method = "delete";
                sendLocation(method, input).fail(function (msg) {
                    assert.fail(msg);
                }).always(function () {
                    done();
                });
            });
        });
    });
    describe('Categories', function () {
        var input = {};
        describe('post', function () {
            it('should add a new category', function (done) {
                var method = "add";
                input.name = "Mocha Test";
                sendCategory(method, input).done(function (msg, response) {
                    assert.ok(response.name === input.name);
                    $.extend(input, response);
                }).fail(function (msg) {
                    assert.fail(msg);
                }).always(function () {
                    done();
                });
            });
        });
        describe('put', function () {
            var method = "update";
            input.name = "Mocha Updated Test";
            it('should update a location in the database', function (done) {
                sendCategory(method, input).done(function (msg, response) {
                    assert.ok(response.name === input.name);
                }).fail(function (msg) {
                    assert.fail(msg);
                }).always(function () {
                    done();
                });
            });
        });
        describe('delete', function () {
            it('should delete a location from the database', function (done) {
                var method = "delete";
                sendCategory(method, input).fail(function (msg) {
                    assert.fail(msg);
                }).always(function () {
                    done();
                });
            });
        });
    });
});