'use strict';

/* Controllers */

warnabrodaApp.controller('LoginController', ['$scope', '$rootScope', '$window', '$location', '$filter', 'deviceDetector', 'AuthenticationSharedService', 'AUTH_EVENTS', 'sha1',
    function ($scope, $rootScope, $window, $location, $filter, deviceDetector, AuthenticationSharedService, AUTH_EVENTS, sha1) {
        var credential = {};
        $scope.authenticationError = null;        

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
            credential.password = sha1.encode(login.password);
            AuthenticationSharedService.login(credential).then(function (user) {
              $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
              $scope.setCurrentUser(user);
              credential.password = null;
            }, function () {
              $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
            });
        }
        
    }]);