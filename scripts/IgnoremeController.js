'use strict';

/* Controllers */

warnabrodaApp.controller('IgnoremeController', ['$scope', '$window', 'deviceDetector', 'WarningService', 'modalDialog', 'vcRecaptchaService',
    function ($scope, $window, deviceDetector, WarningService, modalDialog, vcRecaptchaService) {
    		
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

			var valid;
            /**
             * SERVER SIDE VALIDATION
             *
             * You need to implement your server side validation here.
             * Send the model.captcha object to the server and use some of the server side APIs to validate it
             * See https://developers.google.com/recaptcha/docs/
             */
            console.log('sending the captcha response to the server', vcRecaptchaService.data());
            if (valid) {
                console.log('Success');
            } else {
                console.log('Failed validation');
                // In case of a failed validation you need to reload the captcha because each challenge can be checked just once
                vcRecaptchaService.reload();
            }
			
			console.log($scope);
			var warnService = WarningService.confirmIgnore($scope.ignore);
				warnService.then(function(data) {
					$scope.handleServerResponse(data);	                
	        	}, function(error) {
			       $scope.error = error;
			       $scope.done = null;
			    });
			
		}

		$scope.handleServerResponse = function (data){

			switch(data.id){
				case 200:
					$scope.server_msg_danger = null;
					$scope.server_msg_sucess = data.name;
					
	                $scope.ignore.Confirmation_code = null;
				break;

				case 403:
					$scope.server_msg_sucess = null;
					$scope.server_msg_danger = data.name;
				break;
				default:

				break;
			}
		}

    }]);

