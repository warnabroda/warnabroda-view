'use strict';

warnabrodaApp
    .config(['$routeProvider', '$httpProvider', '$translateProvider', 'USER_ROLES',
        function ($routeProvider, $httpProvider, $translateProvider, USER_ROLES) {
            $routeProvider
                .when('/aviso', {
                    templateUrl: 'views/avisos.html',
                    controller: 'AvisoController',
                    resolve:{
                        resolvedAviso: ['Aviso', function (Aviso) {
                            return Aviso.query();
                        }]
                    },
                    access: {
                        authorizedRoles: [USER_ROLES.all]
                    }
                })
        }]);
