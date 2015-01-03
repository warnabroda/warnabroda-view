'use strict';

/* Controllers */
warnabrodaApp.controller('LanguageController', ['$scope', '$translate', 'LanguageService', 'FLAGS',
    function ($scope, $translate, LanguageService, FLAGS) {
        $scope.getFlagClass = function(language) {
            var selectedFlag = "";
            /**
             * 
             angular.forEach(FLAGS, function(flag, flagLanguage){
                if (language == flagLanguage) {
                    selectedFlag = flag;
                }
            }); */
//            return "famfamfam-flag-" + language;
            return "famfamfam-flag-br";
        };

        $scope.changeLanguage = function (languageKey) {
            $translate.use(languageKey);

            LanguageService.getBy(languageKey).then(function(languages) {
                $scope.languages = languages;
            });
        };

        LanguageService.getBy().then(function (languages) {
            $scope.languages = languages;
        });
    }]);

warnabrodaApp.controller('LogoutController', ['$location', 'AuthenticationSharedService', 
    function ($location, AuthenticationSharedService) {
        AuthenticationSharedService.logout();
    }]);
