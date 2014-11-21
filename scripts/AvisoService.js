'use strict';

/* Services */

warnabrodaApp.factory('AvisoService', ['$resource', '$q', '$http',
   function ($resource, $q, $http) {
	return {
		getTipoAvisos : function() {
			var deferred = $q.defer();
            $http.get('http://localhost/servico/app/rest/aviso/allaviso').success(function(data) {
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
            	deferred.reject(status);
            });
            return deferred.promise;
		},
		getTipoNotificacoes : function() {
			var deferred = $q.defer();
            $http.get('http://localhost/servico/app/rest/aviso/allnotificacao').success(function(data) {
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
            	deferred.reject(status);
            });
            return deferred.promise;
		},
		enviar : function(aviso){
			var deferred = $q.defer();
            $http.post('http://localhost/servico/app/rest/aviso/enviar', aviso).success(function(data) {
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
            	deferred.reject(status);
            });
            return deferred.promise;
		}
	};
}]);