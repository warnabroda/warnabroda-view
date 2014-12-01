'use strict';

/* Controllers */

warnabrodaApp.controller('MainController', ['$scope', '$window', 'deviceDetector', 'WarningService', 'EMAIL_REGEXP',
    function ($scope, $window, deviceDetector, WarningService, EMAIL_REGEXP) {
    	$scope.phone_contact = {};    	
    	$scope.phone_placeholder = "Ex: (12) 12345-1234";
    	$scope.warning = {contact:null}
		
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

	    $scope.teste = function(){
			console.log('teste');
		};
		
		$scope.send = function(){
			$scope.warning.browser = deviceDetector.browser;
			$scope.warning.operating_system = deviceDetector.os;
			$scope.warning.ip = sender_ip;
			$scope.warning.device = deviceDetector.device;
			$scope.warning.raw = deviceDetector.raw.userAgent;
			$scope.email_error = null;
			$scope.showAvisoNotificacao();

			if ($scope.warning.contact){
				console.log($scope.warning.contact);
			} else {
				console.log("VAZIO");
			}


			
			return;
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

		$scope.contactEmpty = function(){
			if ($scope.warning.contact){
				return null;
			} else {
				return true;
			}
		}	

		
		
		$scope.showAvisoNotificacao = function(){
			
			$scope.notification_alert = true;

			switch($scope.warning.id_contact_type) {
			    case 1:
			        $scope.notification_alert = null;			        
					$scope.show_email = true;
					$scope.show_facebook = null;
					$scope.show_phone = null;
					//for the first time, clean contact field, at send sets the contact field
					$scope.warning.contact = $scope.email;
					
			        break;
			    case 2:					
					$scope.show_email = null;
					$scope.show_facebook = null;
					$scope.show_phone = true;
					//for the first time, clean contact field, at send sets the contact field
					$scope.warning.contact = $scope.phone_contact;
					
			        break;
		        case 3:					
					$scope.show_email = null;
					$scope.show_facebook = true;
					$scope.show_phone = null;
					//for the first time, clean contact field, at send sets the contact field
					$scope.warning.contact = $scope.facebook;
					
			        break;
			    default:					
					
			        break;
			}


		}


		
    }]);
