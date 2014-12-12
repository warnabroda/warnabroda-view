'use strict';

/* Controllers */

warnabrodaApp.controller('IgnoremeController', ['$scope', '$window', 'deviceDetector', 'WarningService', 'modalDialog', 
    function ($scope, $window, deviceDetector, WarningService, modalDialog) {
    		
    	$scope.done = null;
    	$scope.error = null;
		
		var browser = $window.navigator.userAgent;
		var sender_ip = ''; 
			$.getJSON("http://jsonip.com?callback=?", function (data) {
				sender_ip = data.ip;
			});
	    
		
		$scope.send = function(){
			$scope.ignore.browser = deviceDetector.browser;
			$scope.ignore.operating_system = deviceDetector.os;
			$scope.ignore.ip = sender_ip;
			$scope.ignore.device = deviceDetector.device;
			$scope.ignore.raw = deviceDetector.raw.userAgent;			
			
			console.log($scope.ignore)
			
		}

    }]);

