'use strict';

/* Controllers */

warnabrodaApp.controller('ApplicationController', ['$scope', '$window', '$location', 'USER_ROLES', 'WarnaAuthService',
    function ($scope, $window, $location, USER_ROLES, WarnaAuthService){
    	$scope.currentUser = null;
	  	$scope.userRoles = USER_ROLES;
	  	$scope.isAuthorized = WarnaAuthService.isAuthorized;
	 
	  	$scope.setCurrentUser = function (user) {
	    	$scope.currentUser = user;
	  	};
    	
}]);

