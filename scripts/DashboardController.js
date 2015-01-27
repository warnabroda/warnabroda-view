'use strict';

/* Controllers */

warnabrodaApp.controller('DashboardController', ['$scope', '$rootScope', 'DashboardService', '$timeout', '$filter',
    function ($scope, $rootScope, DashboardService, $timeout, $filter) {

    	$scope.warn = {}
    	var warnings = {}
    	$scope.warning = {}

    	$scope.searchFilter = {}
    	
	   	var countAllWarnings = DashboardService.countAllWarnings();    		    


	    countAllWarnings.then(function(result) {
	    	if (result) {
	    		$scope.warn = result;
	    		warnings = result;
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
			return new Date(date).toISOString();
		}

		$scope.formatPhone = function(value){

			if (value.indexOf("@") < 0){				
				return $filter('phonenumber')(value);
			}

			return value;

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


    }]);

