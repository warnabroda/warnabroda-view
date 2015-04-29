'use strict';

/* Services */

warnabrodaApp.factory('LanguageService', ['$http', '$translate', 'LANGUAGES', '$rootScope', '$window', 
    function ($http, $translate, LANGUAGES, $rootScope, $window) {
        //$rootScope.language = "";

        return {
            getBy: function(language) {

                if(!angular.isUndefined($rootScope.language) && angular.isUndefined(language)){
                    language = $rootScope.language
                } else if (language == undefined) {
                    language = $translate.storage().get('NG_TRANSLATE_LANG_KEY');
                } 

                if (angular.isUndefined(language)) {
                    angular.forEach(LANGUAGES, function(flag, flagLanguage){
                        //since translation is not specific, we use the general language(en,es,pt) insted specific(en-US, es-ES, pt-BR)
                        if ($window.navigator.language.toLowerCase().substr(0,2) == flagLanguage.toLowerCase().substr(0,2)){
                            language = flagLanguage;
                        }
                    });
                }

                if (angular.isUndefined(language)) {
                    language = "en";
                }
                $translate.use(language);
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