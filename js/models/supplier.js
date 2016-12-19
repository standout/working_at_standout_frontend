'use strict';
angular.module('Standout')
.factory('Supplier', ['$http', 'Config', function($http, Config) {

    class Supplier 
    {
        /**
         * the constructor
         */
        constructor() {
            /**
             * type - the type of request i.e. API route
             */
            this.type = "suppliers"
        }

       /**
        * getAllSuppliers - reads all the suppliers in our db
        * @param  {callback} - a callback function
        * @return {object}  - suppliers object
        */
        getAllSuppliers(callback) {
            Config.getData(Config.GET, this.type, function(suppliers) {
                return callback(suppliers);
            });
        }

       /**
        * getSupplierWithID - gets the selected supplier
        * @return {Array} suppliers
        */
        getSupplierWithID(id, callback) {
            Config.getData(Config.GET, this.type + '/' + id, function(suppliers) {
                return callback(suppliers);
            });
        }

        storeToDB(newSupplier, callback) {
            Config.serverRequest(Config.POST, this.type, newSupplier, function(response) {
                callback(response);
            });
        }

        deleteSupplier(id, callback) {
            Config.serverRequest(Config.DELETE, this.type + '/' + id, {}, function(response) {
                callback(response.status);
            });
        }

    }

    return Supplier;
}])