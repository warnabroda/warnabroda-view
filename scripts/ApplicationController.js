'use strict';

/* Controllers */

warnabrodaApp.controller('ApplicationController', ['$scope', '$window', '$location', 'USER_ROLES', 'AuthenticationSharedService',
    function ($scope, $window, $location, USER_ROLES, AuthenticationSharedService){
    	$scope.currentUser = null;
	  	$scope.userRoles = USER_ROLES;
	  	$scope.isAuthorized = AuthenticationSharedService.isAuthorized;
	 
	  	$scope.setCurrentUser = function (user) {
	    	$scope.currentUser = user;
	  	};
    	
}]);

