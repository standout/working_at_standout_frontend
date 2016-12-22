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
        * @return {Array}  - suppliers Array
        */
        getAllSuppliers(callback) {
            Config.serverRequest(Config.GET, this.type, {}, function(response) {
                return callback(response);
            });
        }

       /**
        * getSupplierWithID - gets the selected supplier
        * @param {Integer} id
        * @param {Callback} callback
        * @return {Object} supplier
        */
        getSupplierWithID(id, callback) {
            Config.serverRequest(Config.GET, this.type + '/' + id, {}, function(response) {
                console.log(response);
                return callback(response.data);
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
                return callback(response);
            });
        }

        /**
         * deleteSupplier - is called to delete the selected supplier
         * @param {Integer} id
         * @param {Callback} callback
         * @return {String} status if the action was successful or not
         */
        deleteSupplier(id, callback) {
            Config.serverRequest(Config.DELETE, this.type + '/' + id, {}, function(response) {;
                return callback(response.status);
            });
        }

    }
    
    //module.exports = Supplier;
    return Supplier;
}])