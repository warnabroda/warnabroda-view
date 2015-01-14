'use strict';

/* Controllers */

warnabrodaApp.controller('IgnoremeConfirmationController', ['$scope', '$window', 'deviceDetector', 'WarningService',
    function ($scope, $window, deviceDetector, WarningService) {
    		
    	$scope.ignore = {};
    	var captcha = {};
    	$scope.captchaControl = {};
		var browser = $window.navigator.userAgent;
		$.getJSON("http://jsonip.com?callback=?", function (data) {
        	captcha.ip = data.ip;
			$scope.ignore.ip = data.ip;
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
	            		var warnService = WarningService.confirmIgnore($scope.ignore);
						warnService.then(function(data) {
							$scope.gRecaptchaResponse = null;
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

			if ($scope.ignore.Confirmation_code.length !== 6){
				$scope.confirmation_code_invalid = true;
				valid = false;
			} else {
				$scope.confirmation_code_invalid = null;
			}			

			return valid;

		}



		$scope.handleServerResponse = function (data){

			switch(data.id){
				case 200:
					$scope.server_msg_danger = null;
					$scope.server_msg_sucess = data.name;
					
	                $scope.ignore.Confirmation_code = null;
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

    }]);

