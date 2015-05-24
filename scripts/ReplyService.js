'use strict';

/* Services */

warnabrodaApp.factory('ReplyService', ['$resource', '$q', '$http',
   function ($resource, $q, $http) {
	return {
		getWarnWithReply : function(hash) {
            var deferred = $q.defer();            
            $http.get('warnabroda/reply/'+hash).success(function(data) {
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
        send : function(reply){
            var deferred = $q.defer();
            $http.post('warnabroda/reply', reply).success(function(data) {
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        setReplyRead : function(reply){
            var deferred = $q.defer();
            $http.put('warnabroda/reply', reply).success(function(data) {
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        }
	};
}]);