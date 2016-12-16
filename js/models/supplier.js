'use strict';
angular.module('Standout')
.factory('Supplier', ['$http', 'Config', function($http, Config) {

    class Supplier 
    {
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

    }

    return Supplier;
}])