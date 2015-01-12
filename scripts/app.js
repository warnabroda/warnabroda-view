'use strict';

/* App Module */
var httpHeaders;

var warnabrodaApp = angular.module('warnabrodaApp', ['http-auth-interceptor', 'tmh.dynamicLocale',
    'ngResource', 'ngRoute', 'ngCookies', 'warnabrodaAppUtils', 'pascalprecht.translate', 'truncate', 'ng.deviceDetector', 'noCAPTCHA', 'ui.bootstrap']);

warnabrodaApp
    .config(['$routeProvider', '$httpProvider', '$translateProvider',  'tmhDynamicLocaleProvider', 'USER_ROLES', 'noCAPTCHAProvider',
        function ($routeProvider, $httpProvider, $translateProvider, tmhDynamicLocaleProvider, USER_ROLES, noCAPTCHAProvider) {
            $routeProvider              
                .when('/hq', {
                    templateUrl: 'views/login.html',
                    controller: 'LoginController',
                    access: {
                        authorizedRoles: [USER_ROLES.all]
                    }
                })
                .when('/error', {
                    templateUrl: 'views/error.html',
                    access: {
                        authorizedRoles: [USER_ROLES.all]
                    }
                })
                .when('/ignoreme', {
                    templateUrl: 'views/ignoreme.html',
                    controller: 'IgnoremeConfirmationController',
                    access: {
                        authorizedRoles: [USER_ROLES.all]
                    }
                })
                .when('/contact', {
                    templateUrl: 'views/modal-contactus.html',
                    controller: 'LanguageController',
                    access: {
                        authorizedRoles: [USER_ROLES.all]
                    }
                })
                .when('/about', {
                    templateUrl: 'views/modal-about.html',
                    controller: 'MainController',
                    access: {
                        authorizedRoles: [USER_ROLES.all]
                    }
                })
                .when('/ignore-request', {
                    templateUrl: 'views/modal-ignore.html',
                    controller: 'IgnoremeRequestController',
                    access: {
                        authorizedRoles: [USER_ROLES.all]
                    }
                })
                .when('/logout', {
                    templateUrl: 'views/main.html',
                    controller: 'LogoutController',
                    access: {
                        authorizedRoles: [USER_ROLES.all]
                    }
                })
                .when('/dashboard', {
                    templateUrl: 'views/dashboard.html',
                    controller: 'DashboardController',
                    access: {
                        authorizedRoles: [USER_ROLES.admin]
                    }
                })
                .otherwise({
                    templateUrl: 'views/main.html',
                    controller: 'MainController',
                    access: {
                        authorizedRoles: [USER_ROLES.all]
                    }
                });

            // Initialize angular-translate
            $translateProvider.useStaticFilesLoader({
                prefix: 'i18n/',
                suffix: '.json'
            });

            $translateProvider.preferredLanguage('pt-br');

            $translateProvider.useCookieStorage();            

            //tmhDynamicLocaleProvider.localeLocationPattern("bower_components/angular-i18n/angular-locale_br.js");
            tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js');
            tmhDynamicLocaleProvider.useCookieStorage('NG_TRANSLATE_LANG_KEY');

            
            
            httpHeaders = $httpProvider.defaults.headers;

            noCAPTCHAProvider.setSiteKey('6LfcKP8SAAAAAG04VXizMXdLiaLj4VRQe_VtKAyB');
            noCAPTCHAProvider.setTheme('clean');            
        }])
        .run(['$rootScope', '$location', '$http', 'AuthenticationSharedService', 'Session', 'USER_ROLES',
            function($rootScope, $location, $http, AuthenticationSharedService, Session, USER_ROLES) {
                $rootScope.authenticated = false;
                $rootScope.$on('$routeChangeStart', function (event, next) {
                    $rootScope.isAuthorized = AuthenticationSharedService.isAuthorized;
                    $rootScope.userRoles = USER_ROLES;
                    AuthenticationSharedService.valid(next.access.authorizedRoles);
                });

                // Call when the the client is confirmed
                $rootScope.$on('event:auth-loginConfirmed', function(data) {
                    $rootScope.authenticated = true;
                    if ($location.path() === "/hq") {
                        var search = $location.search();
                        if (search.redirect !== undefined) {
                            $location.path(search.redirect).search('redirect', null).replace();
                        } else {
                            $location.path('/dashboard').replace();
                        }
                    }
                });

                // Call when the 401 response is returned by the server
                $rootScope.$on('event:auth-loginRequired', function(rejection) {
                    Session.invalidate();
                    $rootScope.authenticated = false;
                    if ($location.path() !== "/" 
                        && $location.path() !== "" 
                        && $location.path() !== "/about" 
                        && $location.path() !== "/contact" 
                        && $location.path() !== "/ignoreme" 
                        && $location.path() !== "/ignore-request" 
                        && $location.path() !== "/hq") {
                        var redirect = $location.path();
                        $location.path('/hq').search('redirect', redirect).replace();
                    }
                });

                // Call when the 403 response is returned by the server
                $rootScope.$on('event:auth-notAuthorized', function(rejection) {
                    $rootScope.errorMessage = 'errors.403';
                    $location.path('/hq').replace();
                });

                // Call when the user logs out
                $rootScope.$on('event:auth-loginCancelled', function() {
                    $location.path('');
                });
        }]);