'use strict';

/* Services */

warnabrodaApp.factory('Account', ['$q', '$http',
   function ($q, $http) {
    return {        
        getAuthenticated : function() {
            var deferred = $q.defer();
            $http.get('warnabroda/hq/auth-on').success(function(data) {
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        }
    };
}]);

warnabrodaApp.factory('Session', function () {
        this.create = function (id, name, user_role, email, last_login) {
            this.id = id;
            this.name = name;
            this.user_role = user_role;
            this.email = email;
            this.last_login = last_login;
        };
        this.invalidate = function () {
            this.id = null;
            this.name = null;
            this.user_role = null;
            this.email = null;
            this.last_login = null;
        };
        return this;
    });

warnabrodaApp.factory('AuthenticationSharedService', ['$rootScope', '$http', 'authService', 'Session', 'Account',
    function ($rootScope, $http, authService, Session, Account) {
        return {
            login: function (param) {

                var req = {
                        method: 'POST',
                        url: 'warnabroda/hq/login',
                        headers: {
                            'Content-Type': 'application/json'                        
                        },
                        data: param,
                    }                
                
                $http(req).success(function (data, status, headers, config) {                    
                
                    Session.create(data.id, data.name, data.user_role, data.email, data.last_login);
                    $rootScope.account = Session;
                    authService.loginConfirmed(data);
                    
                }).error(function (data, status, headers, config) {
                
                    $rootScope.authenticationError = true;
                    Session.invalidate();                    
                });
            },
            valid: function(authorizedRoles){

                $http.get('warnabroda/hq/user/private', {
                    ignoreAuthModule: 'ignoreAuthModule'
                }).success(function (data, status, headers, config) {
                    if (!Session.name){
                        
                        var authUser = Account.getAuthenticated();
                        authUser.then(function(data){
                            Session.create(data.id, data.name, data.user_role, data.email, data.last_login);
                            $rootScope.account = Session;
                            if (!$rootScope.isAuthorized(authorizedRoles)) {
                                // user is not allowed
                               $rootScope.$broadcast("event:auth-notAuthorized");
                            } else {
                                $rootScope.$broadcast("event:auth-loginConfirmed");
                            }
                        },
                        function(error){
                            
                            $rootScope.$broadcast('event:auth-loginRequired', error);
                            
                        });

                    } else{
                        if (!$rootScope.isAuthorized(authorizedRoles)) {
                                // user is not allowed
                                $rootScope.$broadcast("event:auth-notAuthorized");
                        } else {
                                $rootScope.$broadcast("event:auth-loginConfirmed");
                        }
                    }

                }).error(function (data, status, headers, config) {
                    if (!$rootScope.isAuthorized(authorizedRoles)) {
                        $rootScope.$broadcast('event:auth-loginRequired', data);
                    }
                });                
               
            },           
            isAuthorized: function (authorizedRoles) {                

                if (!angular.isArray(authorizedRoles)) {
                    if (authorizedRoles == '*') {
                        return true;
                    }

                    authorizedRoles = [authorizedRoles];
                }

                var isAuthorized = false;
                angular.forEach(authorizedRoles, function(authorizedRole) {
                    var authorized = (!!Session.name &&
                        Session.user_role.indexOf(authorizedRole) !== -1);

                    if (authorized || authorizedRole == '*') {
                        isAuthorized = true;
                    }
                });

                return isAuthorized;
            },
            logout: function () {
                $rootScope.authenticationError = false;
                $rootScope.authenticated = false;
                $rootScope.account = null;

                $http.get('warnabroda/hq/logout');
                Session.invalidate();
                authService.loginCancelled();
            }
        };
    }]);
