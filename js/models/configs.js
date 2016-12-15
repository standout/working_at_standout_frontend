'use strict';
angular.module('Standout')
.factory('Config', ['$http', function($http) {
	
    var Config = {
        url : "http://localhost:9000/api/"
    };

    return Config;
}])