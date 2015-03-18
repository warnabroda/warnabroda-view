'use strict';

/* Services */

warnabrodaApp.factory('DashboardService', ['$q', '$http',
   function ($q, $http) {
	return {		        
        countAllWarnings : function(){
            var deferred = $q.defer();
            $http.get('warnabroda/hq/count-warnings').success(function(data) {
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        getAll : function(filter){
            var deferred = $q.defer();
            $http.get('warnabroda/hq/list-warnings', filter).success(function(data) {
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        get : function(id) {
            var deferred = $q.defer();
            $http.get('warnabroda/hq/warning/'+id).success(function(data) {
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;   
        },
        listMessageStats : function(){
            var deferred = $q.defer();
            $http.get('warnabroda/hq/messages-stats').success(function(data) {
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        getMessage : function(id){
            var deferred = $q.defer();
            $http.get('warnabroda/hq/messages/'+id).success(function(data) {
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise; 
        },
        getUser : function(id) {
            var deferred = $q.defer();            
            $http.get('warnabroda/hq/account/'+id).success(function(data) {
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {                
                deferred.reject(status);
            });
            return deferred.promise;
        },
        saveMessage : function(message){
            var deferred = $q.defer();
            $http.post('warnabroda/hq/messages', message).success(function(data) {
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        }
	};
}]);