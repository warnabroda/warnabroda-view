'use strict';

/* Services */

warnabrodaApp.factory('WarningService', ['$resource', '$q', '$http',
   function ($resource, $q, $http) {
	return {
		getMessages : function() {
			var deferred = $q.defer();
            $http.get('warnabroda/messages').success(function(data) {
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
            	deferred.reject(status);
            });
            return deferred.promise;
		},
		getContactTypes : function() {
			var deferred = $q.defer();
            $http.get('warnabroda/contact_types').success(function(data) {
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
            	deferred.reject(status);
            });
            return deferred.promise;
		},
		send : function(warn){
			var deferred = $q.defer();
            $http.post('warnabroda/warnings', warn).success(function(data) {
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
            	deferred.reject(status);
            });
            return deferred.promise;
		},
        countWarnings : function(){
            var deferred = $q.defer();
            $http.get('warnabroda/count-warnings').success(function(data) {
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        }, 
        ignoreContact : function(contact){
            var deferred = $q.defer();
            $http.post('warnabroda/ignore-list', contact).success(function(data) {
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        confirmIgnore : function(ignore){
            var deferred = $q.defer();
            $http.post('warnabroda/ignore-list-confirm', ignore).success(function(data) {
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        }
	};
}]);