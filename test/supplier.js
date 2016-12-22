describe("Supplier methods", function() {

    var Supplier;
    var allSuppliers;
    var singleSupplier;
    var supplierAdded;
    var supplierDeletedStatus;
    
    // Before each test load our api.users module
    beforeEach(angular.mock.module('Standout'));

    // Before each test set our injected Users factory (_Users_) to our local Users variable
    beforeEach(inject(function(_Supplier_) {
        Supplier = _Supplier_;
    }));

    describe("Get all the suppliers", function() {
        beforeEach(function(done){
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
            let supplier = new Supplier();
            supplier.getAllSuppliers(function(response) {
                allSuppliers = response;
                done();
            });
        });

        it("Status should be 200", function() {
            expect(allSuppliers.status).toEqual(200);
        });
    });

    describe("Get single supplier", function() {
        beforeEach(function(done){
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
            let supplier = new Supplier();
            supplier.getSupplierWithID(1, function(response) {
                singleSupplier = response;
                done();
            });
        });

        it("Status should be 200", function() {
            expect(singleSupplier.status).toEqual(200);
        });
    });

    describe("Add new supplier", function() {
        var newSupplier = {
            "address" : "Hogstorpsvagn 127",
            "email" : "kushtrim.abdiu.16@gmail.com",
            "latitude" : 56.878203,
            "longitude" : 14.845213599999965,
            "name" : "Kushtrim",
            "owner" : "Kushtrim",
            "phone" : "0700505667",
            "tyoe" : "Fruits"
        };

        beforeEach(function(done){
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000;
            let supplier = new Supplier();
            supplier.storeToDB(newSupplier, function(response) {
                supplierAdded = response;
                done();
            });
        });

        it("Status should be 200", function() {
            expect(supplierAdded.status).toEqual(200);
        });
    });

    describe("Delete a supplier", function() {
        beforeEach(function(done){
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000;
            let supplier = new Supplier();
            supplier.deleteSupplier(2, function(response) {
                supplierDeletedStatus = response;
                done();
            });
        });
    });

    it("Status should be 200", function() {
        expect(supplierDeletedStatus).toEqual(200);
    });

});