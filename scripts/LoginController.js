'use strict';

/* Controllers */

warnabrodaApp.controller('LoginController', ['$scope', '$rootScope', '$window', '$location', '$filter', 'deviceDetector', 'WarnaAuthService', 'AUTH_EVENTS',
    function ($scope, $rootScope, $window, $location, $filter, deviceDetector, WarnaAuthService, AUTH_EVENTS) {
        var credential = {};
        $scope.authenticationError = null;

        console.log($rootScope);

        var captcha = {};               
        
        var browser = $window.navigator.userAgent;
        
        $.getJSON("http://jsonip.com?callback=?", function (data) {         
            credential.ip = data.ip;
            captcha.ip = data.ip;
        });     
        
        credential.browser = deviceDetector.browser;
        credential.operating_system = deviceDetector.os;
        credential.device = deviceDetector.device;
        credential.raw = deviceDetector.raw.userAgent;

        $scope.login = function(login){
            credential.username = login.username;
            credential.password = login.password;
            WarnaAuthService.login(credentials).then(function (user) {
              $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
              $scope.setCurrentUser(user);
            }, function () {
              $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
            });
        }
        
    }]);