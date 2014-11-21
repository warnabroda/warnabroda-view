'use strict';

warnabrodaApp.factory('Aviso', ['$resource',
    function ($resource) {
        return $resource('app/rest/avisos/:id', {}, {
            'query': { method: 'GET', isArray: true},
            'get': { method: 'GET'}
        });
    }]);
