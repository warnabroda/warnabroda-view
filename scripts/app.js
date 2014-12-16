'use strict';

/* App Module */
var httpHeaders;

var warnabrodaApp = angular.module('warnabrodaApp', ['http-auth-interceptor', 'tmh.dynamicLocale',
    'ngResource', 'ngRoute', 'ngCookies', 'warnabrodaAppUtils', 'pascalprecht.translate', 'truncate', 'ng.deviceDetector', 'noCAPTCHA']); //, 'reCAPTCHA', 'vcRecaptcha'

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
                    controller: 'MainController',
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

            $translateProvider.preferredLanguage('br');

            $translateProvider.useCookieStorage();

            tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js')
            tmhDynamicLocaleProvider.useCookieStorage('NG_TRANSLATE_LANG_KEY');
            
            httpHeaders = $httpProvider.defaults.headers;

            noCAPTCHAProvider.setSiteKey('6LfcKP8SAAAAAG04VXizMXdLiaLj4VRQe_VtKAyB');
            noCAPTCHAProvider.setTheme('clean');            
        }]);