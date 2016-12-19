'use strict';
angular.module('Standout')
.factory('Config', ['$http', function($http) {
	
    var Config = {

       /**
        * cont the base_url
        */
        BASE_URL : "http://localhost:3000/",

       /**
        * GET HTTP method
        */
        GET : "GET",

       /**
        * POST HTTP method
        */
        POST : "POST",

        /**
         * PUT HTTP method
         */
        PUT : "PUT",

        /**
         * DELETE HTTP method
         */
        DELETE : "DELETE",

       /**
        * getData - gets the data from our API through AJAX
        */
        getData : (reqMethod, endpoint, callback) => {
            $http({
                method: reqMethod,
                url: Config.BASE_URL + endpoint,
            }).then(function successCallback(response) {
                callback(response.data);
            });
        },

        serverRequest : (reqMethod, endpoint, data = {}, callback) => {
            const request = {method : reqMethod, url : Config.BASE_URL + endpoint};
            if (reqMethod == Config.POST || reqMethod == Config.PUT) {
                //we have to add the data to the request too
                request['data'] = data;
            }

            $http(request).then(function successCallback(response) {
                callback(response);
            }, function errorCallback(response) {
                console.log(response);
            });
        }
    };

    return Config;
}])