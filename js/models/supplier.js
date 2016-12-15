'use strict';
angular.module('Standout')
.factory('Supplier', ['$http', function($http) {
	
    var Supplier = {
        
        url : "http://localhost:9000/api/"
    };

    return Supplier;
}])