'use strict';

warnabrodaApp.controller('AvisoController', ['$scope', 'resolvedAviso', 'Aviso',
    function ($scope, resolvedAviso, Aviso) {

        $scope.avisos = resolvedAviso;

        $scope.create = function () {
            Aviso.save($scope.aviso,
                function () {
                    $scope.avisos = Aviso.query();
                    $('#saveAvisoModal').modal('hide');
                    $scope.clear();
                });
        };

        $scope.update = function (id) {
            $scope.aviso = Aviso.get({id: id});
            $('#saveAvisoModal').modal('show');
        };

        $scope.delete = function (id) {
            Aviso.delete({id: id},
                function () {
                    $scope.avisos = Aviso.query();
                });
        };

        $scope.clear = function () {
            $scope.aviso = {id: null, sampleTextAttribute: null, sampleDateAttribute: null};
        };
    }]);
