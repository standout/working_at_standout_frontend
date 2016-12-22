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
         * serverRequest - get the data from our json-server db.sjon
         * @param {String} reqMethod - GET, PUT, POST or DELETE
         * @param {String} endpoint - the url for the request
         * @param {Object} data - the data object that we might want to POST or PUT into the db.json
         * @param {Callback} callback
         * @return {Object} data - the data from the server i.e. json-server db.json 
         */
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
        },
    };

    return Config;
}])