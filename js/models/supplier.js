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
        * @param  {Callback} - a callback function
        * @return {Object}  - suppliers object
        */
        getAllSuppliers(callback) {
            Config.getData(Config.GET, this.type, function(suppliers) {
                return callback(suppliers);
            });
        }

       /**
        * getSupplierWithID - gets the selected supplier
        * @param {Integer} id
        * @param {Callback} callback
        * @return {Array} suppliers
        */
        getSupplierWithID(id, callback) {
            Config.getData(Config.GET, this.type + '/' + id, function(suppliers) {
                return callback(suppliers);
            });
        }

        /**
         * updateSupplier - updates the selected supplier
         * @param {Object} supplier
         * @param {Callback} callback
         * @return {String} status if the action was successful or not
         */
        updateSupplier(supplier, callback) {
            Config.serverRequest(Config.PUT, this.type + '/' + supplier.id, supplier, function(response) {
                callback(response.status);
            });
        }

        /**
         * storeToDB - is called to store the new supplier
         * @param {Object} newSupplier
         * @param {Callback} callback
         * @return {Object} response
         */
        storeToDB(newSupplier, callback) {
            Config.serverRequest(Config.POST, this.type, newSupplier, function(response) {
                callback(response);
            });
        }

        /**
         * deleteSupplier - is called to delete the selected supplier
         * @param {Integer} id
         * @param {Callback} callback
         * @return {String} status if the action was successful or not
         */
        deleteSupplier(id, callback) {
            Config.serverRequest(Config.DELETE, this.type + '/' + id, {}, function(response) {
                callback(response.status);
            });
        }

    }

    return Supplier;
}])