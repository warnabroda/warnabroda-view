'use strict';

/* Controllers */

warnabrodaApp.controller('MainController', ['$scope', '$window', 'deviceDetector', 'WarningService', 'EMAIL_REGEXP', 'VALID_DDD', 'modalDialog', 
    function ($scope, $window, deviceDetector, WarningService, EMAIL_REGEXP, VALID_DDD, modalDialog) {
    		
    	$scope.phone_placeholder = "Ex: (12) 12345-1234";    	
    	$scope.warning = {}
    	
		
		var listMessage = WarningService.getMessages();
		var listContactType = WarningService.getContactTypes();
		var countWarnings = WarningService.countWarnings();
		var browser = $window.navigator.userAgent;
		var sender_ip = ''; 
			$.getJSON("http://jsonip.com?callback=?", function (data) {
				sender_ip = data.ip;
			});
			
		
		
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

	    countWarnings.then(function(result) {
	    	if (result) {
	    		$scope.countWarnings = result;
	        }
	    });

	    
		
		$scope.send = function(){
			$scope.warning.browser = deviceDetector.browser;
			$scope.warning.operating_system = deviceDetector.os;
			$scope.warning.ip = sender_ip;
			$scope.warning.device = deviceDetector.device;
			$scope.warning.raw = deviceDetector.raw.userAgent;
			
			$scope.handleContactTypeSelect();			
			var ok = $scope.validateContact();			
			
			if (ok){
				var warnService = WarningService.send($scope.warning);
				warnService.then(function(data) {
					$scope.handleServerResponse(data);	                
	        	}, function(error) {
			       $scope.error = error;
			       $scope.done = null;
			    });
			} else {				
		    	$scope.error = null;
			}
			
		}

		$scope.handleServerResponse = function (data){
			$scope.error = null;
            $scope.done = null;  	
			switch(data.id){
				case 200:
					$scope.server_msg_danger = null;
					$scope.server_msg_sucess = data.name;

					
					
	                $scope.warning.id_contact_type = null;
	                $scope.warning.id_message = null;	                
	                $scope.sms = null;
	                $scope.email = null;	
	                $scope.facebook = null;
	                
	                $scope.handleContactTypeSelect();                         
	                					
				break;

				case 403:
					$scope.server_msg_sucess = null;
					$scope.server_msg_danger = data.name;
				break;
				default:

				break;
			}
		}		


		$scope.updateContact = function(temp_contact){
			$scope.warning.contact = temp_contact;		
		}	

		$scope.validateContact = function(){

			var contact = $scope.warning.contact?$scope.warning.contact:'';
					
			switch($scope.warning.id_contact_type) {
				case 1:								       
					if (contact.length > 0 && EMAIL_REGEXP.test(contact)){						
						$scope.email_error = null;
					} else {
						$scope.email_error = true;
						return false;
					}
			        break;

			    case 2:						    	
					if (contact.length === 10 || contact.length === 11){
						$scope.invalid_phone_number = null;
					} else {
						$scope.invalid_phone_number = true;
						return false;
					}

					if (contact.length > 0 && VALID_DDD.indexOf(contact.substring(0,2)) > -1){
						$scope.invalid_ddd = null;				
					} else {
						$scope.invalid_ddd = true;	
						return false;			
					}										
			        break;

		        case 3:					        	
					if (contact.length > 0 && contact.indexOf("facebook.com") > 0){
						$scope.invalid_facebook = null;
					} else {
						$scope.invalid_facebook = true;
						return false;
					}										
			        break;		

			}

			return true;				
		}

		$scope.handleContactTypeSelect = function(){
			
			// $scope.notification_alert = true;

			switch($scope.warning.id_contact_type) {
			    case 1:
			    	$scope.warning.contact = $scope.email;
			        // $scope.notification_alert = null;			        
					$scope.show_email = true;
					$scope.show_facebook = null;
					$scope.show_phone = null;					
					
			        break;
			    case 2:								    	
					$scope.show_email = null;
					$scope.show_facebook = null;
					$scope.show_phone = true;
										
			        break;
		        case 3:					
		        	$scope.warning.contact = $scope.facebook;
					$scope.show_email = null;
					$scope.show_facebook = true;
					$scope.show_phone = null;
										
			        break;
			    default:					
					$scope.show_email = null;
					$scope.show_facebook = null;
					$scope.show_phone = null;
			        break;
			}

		}

		$scope.ignoreContact = function(contact){
			
			var ignore = {};
			ignore.browser = deviceDetector.browser;			
			ignore.operating_system = deviceDetector.os;
			ignore.ip = sender_ip;
			ignore.device = deviceDetector.device;
			ignore.raw = deviceDetector.raw.userAgent;
			ignore.contact = contact;
			$scope.ignore_contact_error = null;
			$scope.server_response = null;
			
			if (EMAIL_REGEXP.test(ignore.contact) || (ignore.contact.length === 10 || ignore.contact.length === 11)){
				if (modalDialog.confirm("Você tem certeza que deseja adicionar o contato '"+ignore.contact+"' na Lista de Ignorados?") == true) {
					var warnService = WarningService.ignoreContact(ignore);
					warnService.then(function(data) {							                
						$scope.server_response = data.name;
		        	}, function(error) {
				       $scope.error = error;
				       $scope.done = null;
				    });			      
			      
			    }
				
			} else {
				$scope.ignore_contact_error = true;
			}

			
		}										
		
    }]);

