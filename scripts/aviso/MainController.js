'use strict';

/* Controllers */

warnabrodaApp.controller('MainController', ['$scope', '$window', 'deviceDetector', 'AvisoService', 
    function ($scope, $window, deviceDetector, AvisoService) {
		
		var ta = AvisoService.getTipoAvisos();
		var tn = AvisoService.getTipoNotificacoes();
		var browser = $window.navigator.userAgent;
		var sender_ip = ''; 
			$.getJSON("http://jsonip.com?callback=?", function (data) {
				sender_ip = data.ip;
			});
			
		$scope.error = null;	
		$scope.amigoAvisado = null;
		
		$scope.notificacao_envio = null;   
		
		ta.then(function(result) {
	    	if (result) {
	    		$scope.avisoTipos = result;
	        }
	    });
		
		tn.then(function(result) {
	    	if (result) {
	    		$scope.notificacaoTipos = result;
	        }
	    });
		
		$scope.enviar = function(){
			$scope.aviso.browser = deviceDetector.browser;
			$scope.aviso.sistemaOperacional = deviceDetector.os;
			$scope.aviso.ip = sender_ip;
			$scope.aviso.aparelho = deviceDetector.device;
			$scope.aviso.raw = deviceDetector.raw.userAgent;
			var envioAviso = AvisoService.enviar($scope.aviso);
			envioAviso.then(function() {
                $scope.aviso.contato = null;
                $scope.aviso.idTipoNotificacao = null;
                $scope.aviso.idTipoAviso = null;
                $scope.error = null;
                $scope.amigoAvisado = 'true';
        	}, function(error) {
		       $scope.error = 'error';
		       $scope.amigoAvisado = null;
		    });
		}
		
		$scope.showAvisoNotificacao = function(){
			if ($scope.aviso.idTipoNotificacao === 1){
				$scope.notificacaoEnvio = null;        
			} else {
				$scope.notificacaoEnvio = true;
			}
		}
		
    }]);