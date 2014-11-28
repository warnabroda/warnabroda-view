'use strict';

/* Controllers */

warnabrodaApp.controller('MainController', ['$scope', '$window', 'deviceDetector', 'WarningService', 'EMAIL_REGEXP',
    function ($scope, $window, deviceDetector, WarningService, EMAIL_REGEXP) {
		
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
			$scope.email_error = null;
			if (($scope.warning.id_contact_type === 1) && (EMAIL_REGEXP.test($scope.warning.contact))){
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
			    $scope.email_error = null;
			    $scope.error = null;
			} else {
				$scope.email_error = true;
				$scope.done = null;
			}
			
			
		}
		
		$scope.showAvisoNotificacao = function(){
			
			$scope.notification_alert = true;

			switch($scope.warning.id_contact_type) {
			    case 1:
			        $scope.notification_alert = null;			        
					$scope.warning.contact_placeholder = "Ex: warnabroda@gmail.com";
			        break;
			    case 2:					
					$scope.warning.contact_placeholder = "Ex: 12123456789";
			        break;
		        case 3:					
					$scope.warning.contact_placeholder = "https://www.facebook.com/nome_do_usuario";
			        break;
			    default:					
					$scope.warning.contact_placeholder = "";
			        break;
			}


		}
		
    }]);
