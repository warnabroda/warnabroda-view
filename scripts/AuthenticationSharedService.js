'use strict';

/* Services */
/**
warnabrodaApp.factory('WarnaAuthService', ['$http', 'WarnaSession',  
    function ($http, WarnaSession) {
        var authService = {};
        
        authService.login = function(credential){
            return $http.post('/login', credential).then(function(res){
                WarnaSession.create(res.id, res.name, res.role, res.last_login);
                return res;
            })
        
        };
        authService.isAuthenticated = function () {
            return !!WarnaSession.id;
        };
        authService.isAuthorized = function (authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }
            return (authService.isAuthenticated() &&
                authorizedRoles.indexOf(WarnaSession.userRole) !== -1);
            };

        return authService;
    }]);


warnabrodaApp.factory('WarnaSession', function () {
        this.create = function (id, name, userRole, last_login) {
            this.id = id;
            this.name = name;
            this.userRole = userRole;
            this.last_login = email;
        };
        this.destroy = function () {
            this.id = null;
            this.name = null;
            this.userRole = null;
            this.last_login = null;
        };
        return this;
    });
**/

warnabrodaApp.factory('Account', ['$resource', '$q', '$http',
   function ($resource, $q, $http) {
    return {
        get : function(id) {
            var deferred = $q.defer();
            console.log(id);
            $http.get('warnabroda/account', id).success(function(data) {
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        getAuthenticated : function() {
            var deferred = $q.defer();
            $http.get('warnabroda/accountAuthenticated').success(function(data) {
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

warnabrodaApp.factory('AuthenticationSharedService', function ($rootScope, $http, authService, Session, Account) {
        return {
            login: function (param) {
                //var data ="j_username=" + encodeURIComponent(param.username) +"&j_password=" + encodeURIComponent(param.password) +"&_spring_security_remember_me=" + param.rememberMe +"&submit=Login";
                $http.post('warnabroda/authentication', param, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    ignoreAuthModule: 'ignoreAuthModule'
                }).success(function (data, status, headers, config) {                    
                    
                    Session.create(data.id, data.name, data.user_hole, data.email, data.last_login);
                    $rootScope.account = Session;
                    authService.loginConfirmed(data);
                    
                }).error(function (data, status, headers, config) {
                    $rootScope.authenticationError = true;
                    Session.invalidate();
                });
            },
            valid: function(authorizedRoles){

                if (!Session.name){

                    var authUser = Account.get();

                     authUser.then(function(data){

                        $rootScope.$broadcast("event:auth-loginConfirmed");
                    },
                    function(error){
                        if (!$rootScope.isAuthorized(authorizedRoles)) {
                            $rootScope.$broadcast('event:auth-loginRequired', error);
                        }
                    });

                } else {
                    if (!$rootScope.isAuthorized(authorizedRoles)) {
                            // user is not allowed
                            $rootScope.$broadcast("event:auth-notAuthorized");
                    } else {
                            $rootScope.$broadcast("event:auth-loginConfirmed");
                    }
                }
                
               
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

                $http.get('warnabroda/logout');
                Session.invalidate();
                authService.loginCancelled();
            }
        };
    });
