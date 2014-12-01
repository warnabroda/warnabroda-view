'use strict';

angular.module('warnabrodaApp')
    .directive('activeMenu', ['$translate', '$locale', 'tmhDynamicLocale', function($translate, $locale, tmhDynamicLocale) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs, controller) {
                var language = attrs.activeMenu;

                scope.$watch(function() {
                    return $translate.use();
                }, function(selectedLanguage) {
                    if (language === selectedLanguage) {
                        tmhDynamicLocale.set(language);
                        element.addClass('active');
                    } else {
                        element.removeClass('active');
                    }
                });
            }
        };
    }])
    .directive('activeLink', ['$location', function(location) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs, controller) {
                var clazz = attrs.activeLink;
                var path = attrs.href;
                path = path.substring(1); //hack because path does bot return including hashbang
                scope.location = location;
                scope.$watch('location.path()', function(newPath) {
                    if (path === newPath) {
                        element.addClass(clazz);
                    } else {
                        element.removeClass(clazz);
                    }
                });
            }
        };
    }]).directive('passwordStrengthBar', function() {
        return {
            replace: true,
            restrict: 'E',
            template: '<div id="strength">' +
                      '<small translate="global.messages.validate.newpassword.strength">Password strength:</small>' +
                      '<ul id="strengthBar">' +
                        '<li class="point"></li><li class="point"></li><li class="point"></li><li class="point"></li><li class="point"></li>' +
                      '</ul>' +
                    '</div>',
            link: function(scope, iElement, attr) {
                var strength = {
                    colors: ['#F00', '#F90', '#FF0', '#9F0', '#0F0'],
                    mesureStrength: function (p) {

                        var _force = 0;
                        var _regex = /[$-/:-?{-~!"^_`\[\]]/g; // "
                                              
                        var _lowerLetters = /[a-z]+/.test(p);                    
                        var _upperLetters = /[A-Z]+/.test(p);
                        var _numbers = /[0-9]+/.test(p);
                        var _symbols = _regex.test(p);
                                              
                        var _flags = [_lowerLetters, _upperLetters, _numbers, _symbols];                    
                        var _passedMatches = $.grep(_flags, function (el) { return el === true; }).length;                                          
                        
                        _force += 2 * p.length + ((p.length >= 10) ? 1 : 0);
                        _force += _passedMatches * 10;
                            
                        // penality (short password)
                        _force = (p.length <= 6) ? Math.min(_force, 10) : _force;                                      
                        
                        // penality (poor variety of characters)
                        _force = (_passedMatches == 1) ? Math.min(_force, 10) : _force;
                        _force = (_passedMatches == 2) ? Math.min(_force, 20) : _force;
                        _force = (_passedMatches == 3) ? Math.min(_force, 40) : _force;
                        
                        return _force;

                    },
                    getColor: function (s) {

                        var idx = 0;
                        if (s <= 10) { idx = 0; }
                        else if (s <= 20) { idx = 1; }
                        else if (s <= 30) { idx = 2; }
                        else if (s <= 40) { idx = 3; }
                        else { idx = 4; }

                        return { idx: idx + 1, col: this.colors[idx] };
                    }
                };  
                scope.$watch(attr.passwordToCheck, function(password) {
                    if (password) {
                        var c = strength.getColor(strength.mesureStrength(password));
                        iElement.removeClass('ng-hide');
                        iElement.find('ul').children('li')
                            .css({ "background": "#DDD" })
                            .slice(0, c.idx)
                            .css({ "background": c.col });
                    }
                });
            }
        }
    }).directive('phonenumberDirective', ['$filter', function($filter) {
        /*
        Intended use:
            <phonenumber-directive placeholder='prompt' model='someModel.phonenumber'></phonenumber-directive>
        Where:
            someModel.phonenumber: {String} value which to bind only the numeric characters [0-9] entered
                ie, if user enters 617-2223333, value of 6172223333 will be bound to model
            prompt: {String} text to keep in placeholder when no numeric input entered
        */
 
        function link(scope, element, attributes) {
 
            // scope.inputValue is the value of input element used in template
            scope.inputValue = scope.phonenumberModel;
 
            scope.$watch('inputValue', function(value, oldValue) {
                
                value = String(value);
                var number = value.replace(/[^0-9]+/g, '');
                scope.phonenumberModel = number;
                scope.inputValue = $filter('phonenumber')(number);
            });
        }
        
        return {
            link: link,
            restrict: 'E',
            scope: {
                phonenumberPlaceholder: '=placeholder',
                phonenumberModel: '=model',
            },
            //templateUrl: '/static/phonenumberModule/template.html',
            template: '<input ng-model="inputValue" type="tel" class="form-control" placeholder="{{phonenumberPlaceholder}}" title="Informe seu celular">',
        };
    }])
 
    .filter('phonenumber', function() {
        /* 
        Format phonenumber as: c (xxx) xxx-xxxx
            or as close as possible if phonenumber length is not 10
            if c is not '1' (country code not USA), does not use country code
        */
        
        return function (number) {
            /* 
            @param {Number | String} number - Number that will be formatted as telephone number
            Returns formatted number: (###) ###-####
                if number.length < 4: ###
                else if number.length < 7: (###) ###
 
            Does not handle country codes that are not '1' (USA)
            */
            if (!number) { return ''; }
 
            number = String(number);
 
            // Will return formattedNumber. 
            // If phonenumber isn't longer than an area code, just show number
            var formattedNumber = number;
 
            // if the first character is '1', strip it out and add it back
            var c = '';
            //number = number[0] == '1' ? number.slice(1) : number;
            
            if (number.length <= 10){            
                // (##) ####-#### as c (area) front-end
                var area = number.substring(0,2);
                var front = number.substring(2, 6);
                var end = number.substring(6, 11);
            } else {
                // (##) #####-#### as c (area) front-end
                var area = number.substring(0,2);
                var front = number.substring(2, 7);
                var end = number.substring(7, 11);
            }
 
            if (front) {
                formattedNumber = (c + "(" + area + ") " + front);  
            }
            if (end) {
                formattedNumber += ("-" + end);
            }
            return formattedNumber;
        };
    });
