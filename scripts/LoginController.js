'use strict';

/* Controllers */

warnabrodaApp.controller('LoginController', ['$scope', '$window', 'deviceDetector', 'AuthenticationSharedService', 'sha1',
    function ($scope, $window, deviceDetector, AuthenticationSharedService, sha1) {
        var credential = {};            

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
            AuthenticationSharedService.login(credential);
        }
        
    }]);