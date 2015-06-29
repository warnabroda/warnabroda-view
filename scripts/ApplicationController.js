'use strict';

/* Controllers */

warnabrodaApp.controller('ApplicationController', ['$scope', '$window', '$location', 'USER_ROLES', 'AuthenticationSharedService', 'deviceDetector', 
    function ($scope, $window, $location, USER_ROLES, AuthenticationSharedService, deviceDetector){
    	$scope.currentUser = null;
	  	$scope.userRoles = USER_ROLES;
	  	$scope.isAuthorized = AuthenticationSharedService.isAuthorized;
	  	$scope.deviceDetectorTest = deviceDetector;
	  	$scope.test = "Nao deu!";
	 
	  	$scope.setCurrentUser = function (user) {
	    	$scope.currentUser = user;	    	
	  	};
    	
}]);

