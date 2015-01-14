'use strict';

/* Controllers */

warnabrodaApp.controller('IgnoremeRequestController', ['$scope', '$window', 'deviceDetector', 'WarningService', 'EMAIL_REGEXP', 'VALID_DDD',
    function ($scope, $window, deviceDetector, WarningService, EMAIL_REGEXP, VALID_DDD) {
    	    	
    	$scope.ignore = {};
		var captcha = {};    			
		$scope.captchaControl = {};
		var browser = $window.navigator.userAgent;
		
		$.getJSON("http://jsonip.com?callback=?", function (data) {			
			$scope.ignore.ip = data.ip;
			captcha.ip = data.ip;
		});	    
		
		$scope.ignore.browser = deviceDetector.browser;
		$scope.ignore.operating_system = deviceDetector.os;
		$scope.ignore.device = deviceDetector.device;
		$scope.ignore.raw = deviceDetector.raw.userAgent;

		$scope.$watch('language', function(value, oldValue) {
            $scope.ignore.lang_key = value;                    
        });

		$scope.send = function(){

            captcha.response = $scope.gRecaptchaResponse;            

            if ($scope.validate()){
            	
            	var captchaReturn = WarningService.validateCaptcha(captcha);
            	
            	captchaReturn.then(function(data){
            		
	            	if (data.success == true){
	            		var warnService = WarningService.ignoreContact($scope.ignore);
						warnService.then(function(data) {
							$scope.handleServerResponse(data);
			        	}, function(error) {
					       $scope.error = error;					       
					    });           		
	            	} else {
	            		$scope.captcha_invalid = true;	
	            	}
	            });
            }
			$scope.captchaControl.reset();
		}

		$scope.validate = function(){

			var valid = true;

			if (angular.isUndefined($scope.gRecaptchaResponse)){
				$scope.captcha_invalid = true;
				valid = false;
			} else {
				$scope.captcha_invalid = null;
			}

			var contact = $scope.ignore.contact;
			

			if (EMAIL_REGEXP.test(contact)){				
				$scope.contact_invalid = null;
				$scope.invalid_ddd = null;
			} else if (contact.replace(/[^0-9+.]/g, '').length === contact.length && (contact.length === 10 || contact.length === 11)){				
				if (VALID_DDD.indexOf(contact.substring(0,2)) > -1){
					$scope.invalid_ddd = null;
				} else {
					$scope.invalid_ddd = true;	
					valid = false;			
				}
			} else {
				$scope.contact_invalid = true;
				valid = false;
			}

			return valid;

		}

		$scope.handleServerResponse = function (data){
			$scope.error = null;
			$scope.contact_invalid = null;
			$scope.invalid_ddd = null;
			$scope.captcha_invalid = null;
            	
			switch(data.id){
				case 200:
					$scope.server_msg_danger = null;
					$scope.server_msg_success = data.name;					
				break;

				case 403:
					$scope.server_msg_danger = data.name;
					$scope.server_msg_success = null;
				break;

				default:
					$scope.server_msg_danger = null;
					$scope.server_msg_success = null;
					$scope.error = true;	
				break;
			}
		}										
		
    }]);

