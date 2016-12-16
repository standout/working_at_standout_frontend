'use strict';
angular.module('Standout')
.factory('Config', ['$http', function($http) {
	
    var Config = {

       /**
        * cont the base_url
        */
        BASE_URL : "http://localhost:3000/",

       /**
        * GET method
        */
        GET : "GET",

       /**
        * POST method
        */
        POST : "POST",

       /**
        * getData - gets the data from our API through AJAX
        */
        getData : function(reqMethod, endpoint, callback) {
            $http({
                method: reqMethod,
                url: Config.BASE_URL + endpoint,
            }).then(function successCallback(response) {
                callback(response.data);
            });
        }
    };

    return Config;
}])