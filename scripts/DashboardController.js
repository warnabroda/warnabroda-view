'use strict';

/* Controllers */

warnabrodaApp.controller('DashboardController', ['$scope', '$rootScope', 'DashboardService', '$timeout', '$filter', 'LANGUAGES',
    function ($scope, $rootScope, DashboardService, $timeout, $filter, LANGUAGES) {

    	$scope.warn = {}
    	var warnings = {}
    	$scope.warning = {}
    	$scope.message = {}
    	$scope.ip = {}
    	$scope.userName = '';
    	$scope.searchFilter = {}
    	$scope.server_msg_error = null;
		$scope.server_msg_success = null;
		$scope.languages = LANGUAGES;
    	

	    $scope.generateStatiscts = function(){
		   	var countAllWarnings = DashboardService.countAllWarnings(); 

		    countAllWarnings.then(function(result) {
		    	if (result) {
		    		$scope.warn = result;
		    		warnings = result;
		        }
		    });	    	
	    }

	    $scope.generateStatiscts();

	    $scope.loadMessageList = function(){
	    	var listMessage = DashboardService.listMessageStats();
	    	listMessage.then(function(result) {
	    		if (result) {	    		
	    			$scope.messages = result;
	        	}
	    	});

	    }

	   	$scope.ipDetails = function (ip){
	   		
	   		if (ip && !angular.isUndefined(ip)){
	    		$.get("http://ipinfo.io/" + $scope.getIp(ip) + "/json", function(response) {
		    		
		    		$timeout(function() {
				     	$scope.ip = response;
					}, 100);
				 }, "jsonp");
			}
	   	}

	   	$scope.googleMapString = function (str){
	   		return "https://maps.googleapis.com/maps/api/staticmap?center="+str+"&zoom=13&size=500x400&sensor=true&maptype=hybrid&markers=color:blue%7Clabel:S%7C"+str;
	   	}



	    $scope.setPage = function(pageNo) {
			$scope.currentPage = pageNo;
		};
		
		$scope.filter = function() {
			$timeout(function() {
				$scope.filteredItems = warnings.All;
			}, 10);
		};

		$scope.sort_by = function(predicate) {
			$scope.predicate = predicate;
			$scope.reverse = !$scope.reverse;
		};

		$scope.formatDate = function(date){
			
			if (date && !angular.isUndefined(date) && date != '0000-00-00 00:00:00'){
				return new Date(date).toISOString();
			} else {
				return new Date().toISOString();
			}
		}	

		$scope.doSearch = function (sFilter){
		    var allWarns = DashboardService.getAll(sFilter);
		    allWarns.then(function(data){	   		    	
				$scope.list = data;
				$scope.currentPage = 1; //current page
				$scope.entryLimit = 10; //max no of items to display in a page
				$scope.filteredItems = warnings.All; //Initially for no filter
				$scope.totalItems = warnings.All;
	    	});
		}

		$scope.warningDetailShowModal = function (id, ct, m) {

			var w = DashboardService.get(id);
			w.then(function(data){
				$scope.ipDetails(data.ip);
				$scope.warning = data;
				$scope.selectedMessage = m;
				$scope.selectedContactType = ct;
			});
            
            $('#dataModal').modal('show');
        };

        $scope.warningDetailHideModal = function(){
        	$scope.warning = {}
        	$scope.selectedMessage = null;
			$scope.selectedContactType = null;
            $('#dataModal').modal('hide');	
        }

        $scope.getIp = function(strIp){
        	if (strIp.indexOf(",") > -1){
        		var ips = strIp.split(",");
        		return ips[1];
        	}

        	return strIp;

        }

        $scope.formatReturnMessage = function(w){
        	
        	if (w.id_contact_type === 1){
        		var formatedMessage = w.message.replace(","," , ");
        		formatedMessage 	= formatedMessage.replace("{","{ ");
        		formatedMessage 	= formatedMessage.replace("}"," }");
        		return formatedMessage;
        	}

        	return w.message
        }     
        console.log($rootScope);   

        $scope.setTab = function (tabId) {



        	if (angular.isUndefined(tabId)){
        		tabId = 1;
        	}
        	
        	switch (tabId) {
        		case 1: 
        			$scope.generateStatiscts();
        		break;
        		case 2:
        			$scope.loadMessageList();
        		break;
        		case 3: 
        			$scope.doSearch();
        		break;
        	}

        	
        	$rootScope.tab = tabId;
            
        };

        $scope.setTab($rootScope.tab);

        $scope.isSet = function (tabId) {        	
            return $rootScope.tab === tabId;
        };

        $scope.messageShowModal = function (id) {
        	$scope.server_msg_error = null;
			$scope.server_msg_success = null;

			if (angular.isUndefined(id)){
				$scope.message = {};
				$scope.userName = $scope.account.name;
			} else {
				var msg = DashboardService.getMessage(id);
				msg.then(function(data){
					$scope.message = data;
					var msgUser = DashboardService.getUser(data.Last_modified_by);
		        	msgUser.then(function(userData){
		        		$scope.userName = userData.name;
		        	});
				});
			}
            
            $('#messageModal').modal('show');
        };

        $scope.messageHideModal = function(){
        	$scope.message = {}
        	$scope.userName = '';
        	$scope.server_msg_error = null;
			$scope.server_msg_success = null;
        	
            $('#messageModal').modal('hide');	
        };

        $scope.saveMessage = function(){
        	
        	$scope.message.Last_modified_date = new Date();        	
        	var savedMsg = DashboardService.saveMessage($scope.message);
        	savedMsg.then(function(data){
        		$scope.server_msg_success = true;
        		$scope.server_msg_error = null;
        		$scope.message = {};
        		$scope.loadMessageList();
        	}, function(error) {
			   $scope.server_msg_success = null;
        		$scope.server_msg_error = true;		       
		    });
        	$scope.messageHideModal();
        }
        

    }]);