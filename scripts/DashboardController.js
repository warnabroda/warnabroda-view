'use strict';

/* Controllers */

warnabrodaApp.controller('DashboardController', ['$scope', '$rootScope', 'DashboardService', '$timeout', '$filter',
    function ($scope, $rootScope, DashboardService, $timeout, $filter) {

    	$scope.warn = {}
    	var warnings = {}
    	$scope.warning = {}
    	$scope.ip = {}

    	$scope.searchFilter = {}
    	
	   	var countAllWarnings = DashboardService.countAllWarnings();  
	    var listMessage = DashboardService.listMessageStats();

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

	    countAllWarnings.then(function(result) {
	    	if (result) {
	    		$scope.warn = result;
	    		warnings = result;
	        }
	    });

        listMessage.then(function(result) {
	    	if (result) {
	    		console.log(result);
	    		$scope.messages = result;
	        }
	    }); 



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

		$scope.doSearch();

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


        $scope.tab = 1;

        $scope.setTab = function (tabId) {
            $scope.tab = tabId;
        };

        $scope.isSet = function (tabId) {
            return $scope.tab === tabId;
        };


    }]);