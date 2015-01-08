'use strict';

/* Services */

// warnabrodaApp.factory('LanguageService', ['$http', '$translate',
//     function ($http, $translate) {
//         return {
//             getBy: function(language) {
//                 if (language == undefined) {
//                     language = $translate.storage().get('NG_TRANSLATE_LANG_KEY_WARNABRODA');
//                 }

//                 var promise =  $http.get('/i18n/' + language + '.json').then(function(response) {

//                     var languages = [];
//                     languages.push('br');

//                     return languages;
//                 });
//                 return promise;
//             }
//         };
//     }]);


warnabrodaApp.factory('LanguageService', ['$http', '$translate', 'LANGUAGES', '$rootScope',
    function ($http, $translate, LANGUAGES, $rootScope) {
        $rootScope.language = "";

        return {
            getBy: function(language) {
                if (language == undefined) {
                    language = $translate.storage().get('NG_TRANSLATE_LANG_KEY_WARNABRODA');
                }
                if (language == undefined) {
                    language = 'pt-br';
                }
                $rootScope.language = language;
                var promise =  $http.get('i18n/' + language + '.json').then(function(response) {
                    return LANGUAGES;
                });
                return promise;
            }
        };
    }]);

warnabrodaApp.factory('modalDialog', ['$window', function($window) {
    return {
        confirm: function(message) {
            return $window.confirm(message);
        }
    }
}]);