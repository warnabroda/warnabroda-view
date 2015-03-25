'use strict';

/* Controllers */

warnabrodaApp.controller('MainController', ['$scope', '$window', '$location', '$filter', 'deviceDetector', 'WarningService', 'EMAIL_REGEXP', 'VALID_DDD', 
    function ($scope, $window, $location, $filter, deviceDetector, WarningService, EMAIL_REGEXP, VALID_DDD) {

    	$scope.warning = {} 
    	$scope.warning.browser = deviceDetector.browser;
		$scope.warning.operating_system = deviceDetector.os;			
		$scope.warning.device = deviceDetector.device;
		$scope.warning.raw = deviceDetector.raw.userAgent;
		$scope.response = {};
		$scope.response.type = 2;
		$scope.warning.warning_resp = {};
		
		var listContactType = WarningService.getContactTypes();
		var countWarnings = WarningService.countWarnings();
		var browser = $window.navigator.userAgent;
		
		$.getJSON("http://jsonip.com?callback=?", function (data) {
			$scope.warning.ip = data.ip;
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

	    /**
			BEGIN OF WATCHERS: Code block for the angularjs watchers, used by language and contact components
	    */

	    $scope.$watch('language', function(value, oldValue) {

            $scope.warning.lang_key = value;
            var listMessage = WarningService.getMessages(value);  
            listMessage.then(function(result) {
		    	if (result) {
		    		$scope.messages = result;
		        }
		    });         
		    $scope.handleContactTypeSelect();
        });		

	    $scope.$watch('sms', function(value, oldValue) {            
            
            
            $scope.warning.contact = String($("#sms-number").intlTelInput("getNumber"));
            
        });

        $scope.$watch('whatsapp', function(value, oldValue) {
            
            $scope.warning.contact = String($("#mobile-number").intlTelInput("getNumber"));
            
        });

        $scope.$watch('email', function(value, oldValue) {
            
            $scope.warning.contact = String(value);
            
        });

        $scope.$watch('response.whatsapp', function(value, oldValue) {
            
            $scope.response.contact = String($("#mobile-number-response").intlTelInput("getNumber"));
            
        });

        $scope.$watch('response.email', function(value, oldValue) {
            
            $scope.response.contact = String(value);
            
        });
		
		/**
			END OF WATCHERS
	    */

		$scope.send = function(){			
			
			if ($scope.validateContact()){
				if ($scope.acceptResponse){					
					$scope.warning.warning_resp.reply_to = $scope.response.contact;
				} 
					console.log($scope.warning);
					return;
				

				$scope.warning.created_date = new Date();
				
				var warnService = WarningService.send($scope.warning);
				warnService.then(function(data) {
					$scope.handleServerResponse(data);	                
	        	}, function(error) {
			       $scope.error = error;			       
			    });
			} else {				
		    	$scope.error = null;
			}
			
		}

		$scope.handleServerResponse = function (data){			

			$scope.error = null;

			$scope.invalid_facebook = null;
			$scope.email_error = null;
			$scope.invalid_phone_number = null;
			$scope.invalid_ddd = null;				
             	
			switch(data.id){
				case 200:

					$scope.server_msg_danger = null;
					$scope.server_msg_sucess = data.name;
					
	                $scope.warning.id_contact_type = null;
	                $scope.warning.id_message = null;
	                $scope.warning.contact = null;
	                $scope.sms = null;
	                $scope.email = null;	
	                $scope.facebook = null;

	                $("#mobile-number").intlTelInput("setNumber", "");
	                $("#sms-number").intlTelInput("setNumber", "");
	                
	                $scope.reRenderView();

				break;

				case 403:
					$scope.server_msg_danger = data.name;
					$scope.server_msg_sucess = null;
				break;
				default:
					$scope.server_msg_danger = null;
					$scope.server_msg_sucess = null;
				break;
			}
		}

		$scope.validateContact = function(){

			var contact = $scope.warning.contact;
					
			switch($scope.warning.id_contact_type) {
				case 1:
					
					if (contact.length > 0 && EMAIL_REGEXP.test(contact)){
						$scope.email_error = null;
					} else {
						$scope.email_error = true;
						return false;
					}
					$scope.warning.contact = contact;
			        break;

			    case 2:
			    	
					if ($("#sms-number").intlTelInput("isValidNumber")){
						$scope.invalid_phone_number = null;
					} else {
						$scope.invalid_phone_number = true;
						return false;
					}

					if (contact.length > 0 && VALID_DDD.indexOf(contact.substring(3,5)) > -1){
						$scope.invalid_ddd = null;
					} else {
						$scope.invalid_ddd = true;	
						return false;
					}
			        break;

		        case 3:	
		        	if ($("#mobile-number").intlTelInput("isValidNumber")){		        		
		        		$scope.invalid_whatsapp = null;
		        	} else {
		        		$scope.invalid_whatsapp = true;
		        		return false;
		        	}		        	
		        	
			        break;		
		        	

			}

			return true;
		}

		$scope.handleContactTypeSelect = function(){

			$scope.server_msg_danger = null;
			$scope.server_msg_sucess = null;
			$scope.reRenderView();
		}

		$scope.reRenderView = function(){	
			

			switch($scope.warning.id_contact_type) {
			    case 1:
					$scope.show_email = true;
					$scope.show_whats = null;
					$scope.show_phone = null;
					
			        break;
			    case 2:					
					$scope.show_email = null;
					$scope.show_whats = null;
					$scope.show_phone = true;
										
			        break;
		        case 3:							        	
					$scope.show_email = null;
					$scope.show_whats = true;
					$scope.show_phone = null;
										
			        break;
			    default:					
					$scope.show_email = null;
					$scope.show_whats = null;
					$scope.show_phone = null;
			        break;
			}

		}

		$scope.isPhoneNumberIlegal = function(){
			if ($scope.show_whats != null && !$("#mobile-number").intlTelInput("isValidNumber")){
				return true;
			}

			if ($scope.show_phone != null && !$("#sms-number").intlTelInput("isValidNumber")){
				return true;
			}

			return null;
		}
										
		
    }]);

