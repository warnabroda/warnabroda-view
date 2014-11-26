'use strict';

/* Controllers */

warnabrodaApp.controller('MainController', ['$scope', '$window', 'deviceDetector', 'WarningService', 
    function ($scope, $window, deviceDetector, WarningService) {
		
		var listMessage = WarningService.getMessages();
		var listContactType = WarningService.getContactTypes();
		var browser = $window.navigator.userAgent;
		var sender_ip = ''; 
			$.getJSON("http://jsonip.com?callback=?", function (data) {
				sender_ip = data.ip;
			});
			
		$scope.error = null;	
		$scope.done = null;
		
		$scope.notificacao_envio = null;   
		
		listMessage.then(function(result) {
	    	if (result) {
	    		$scope.messages = result;
	        }
	    });
		
		listContactType.then(function(result) {
	    	if (result) {
	    		$scope.contactTypes = result;
	        }
	    });
		
		$scope.send = function(){
			$scope.warning.browser = deviceDetector.browser;
			$scope.warning.operating_system = deviceDetector.os;
			$scope.warning.ip = sender_ip;
			$scope.warning.device = deviceDetector.device;
			$scope.warning.raw = deviceDetector.raw.userAgent;
			console.log($scope.warning);
			var warnService = WarningService.send($scope.warning);
			warnService.then(function() {
                $scope.warning.contact = null;
                $scope.warning.id_contact_type = null;
                $scope.warning.id_message = null;
                $scope.error = null;
                $scope.done = 'true';
        	}, function(error) {
		       $scope.error = 'error';
		       $scope.done = null;
		    });
		}
		
		$scope.showAvisoNotificacao = function(){
			if ($scope.warning.id_contact_type === 1){
				$scope.notification_alert = null;        
			} else {
				$scope.notification_alert = true;
			}
		}
		
    }]);
