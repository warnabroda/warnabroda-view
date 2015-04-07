'use strict';

/* Controllers */

warnabrodaApp.controller('ReplyController', ['$scope', '$window', '$location', '$filter', 'deviceDetector', 'WarningService', '$routeParams', 'ReplyService', 
    function ($scope, $window, $location, $filter, deviceDetector, WarningService, $routeParams, ReplyService) {
		$scope.hash = $routeParams.hash;
		$scope.warning = {};
		$scope.warning_resp = {};
		$scope.validHash = null;
		$scope.msg = "";
		$scope.renderMode = "";
		$scope.isReplyed = null;
		$scope.error = null;
		
		$scope.warning_resp.browser = deviceDetector.browser;
		$scope.warning_resp.operating_system = deviceDetector.os;
		$scope.warning_resp.device = deviceDetector.device;
		$scope.warning_resp.raw = deviceDetector.raw.userAgent;

		$.getJSON("http://jsonip.com?callback=?", function (data) {
			$scope.warning_resp.ip = data.ip;
		});		
		
		var warnByHash = ReplyService.getWarnWithReply($scope.hash);

		warnByHash.then(function(result) {
			$scope.validHash = true;
	    	$scope.warning = result;
	    	
	    	var warnaMessage = ReplyService.getMessage(result.id_message);

	    	if ($scope.warning.warning_resp.resp_hash != "" && $scope.warning.warning_resp.read_hash == "") {
	    		$scope.renderMode = "reply";
	    	} else if($scope.warning.warning_resp.read_hash != "" && $scope.warning.warning_resp.resp_hash == ""){
	    		$scope.renderMode = "read";
	    		var replyRead = {};
	    		
	    		replyRead.id 			= $scope.warning.warning_resp.id;
	    		replyRead.read_hash 	= $scope.warning.warning_resp.read_hash;
	    		replyRead.response_read = new Date();    		

	    		var warnaReplyRead = ReplyService.setReplyRead(replyRead);
	    		
	    	}

	    	if ($scope.warning.warning_resp.message != ""){
	    		$scope.isReplyed = true;
	    	}

	    	warnaMessage.then(function(m) {
	    		$scope.msg = m.name;
	    	});
	        
	    }).catch( function(){
	    	$scope.validHash = false;	    	
	    });

	    $scope.goHome = function(){
	    	$window.location = '/';
	    }

	    $scope.reply = function(){
	    	$scope.warning_resp.reply_date = new Date();
	    	$scope.warning_resp.id = $scope.warning.warning_resp.id;
	    	$scope.warning_resp.resp_hash = $scope.hash;	    	

	    	var replyService = ReplyService.send($scope.warning_resp);
			replyService.then(function(data) {
				$scope.isReplyed = true;
				$scope.error = null;
				$scope.warning.warning_resp.message = $scope.warning_resp.message;
        	}, function(error) {
		       $scope.error = true;
		    });
	    }
	    
	
		
		

		
    }]);

