'use strict';

/* Constants */

warnabrodaApp.constant('USER_ROLES', {
        all: '*',
        admin: 'ROLE_ADMIN',
        user: 'ROLE_USER'
    });

// Define for each locale the associated flag
// It will be used by the library "http://www.famfamfam.com/lab/icons/flags/"
// to display the flag
warnabrodaApp.constant('FLAGS', {
		    br: 'br',
        da: 'dk',
        en: 'gb',
        es: 'es',
        fr: 'fr',
        kr: 'kr',
        de: 'de',
        pl: 'pl',
        ru: 'ru',
        tr: 'tr'
    });

warnabrodaApp.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
});

warnabrodaApp.constant('VALID_DDD', '11,12,13,14,15,16,17,18,19,68,82,96,97,92,77,75,73,74,71,88,85,28,27,61,62,64,99,98,65,66,67,34,37,31,33,35,38,32,91,93,94,83,43,41,42,43,44,45,46,81,87,86,89,21,22,24,84,51,53,54,55,69,95,49,47,48,79,63');
warnabrodaApp.constant('EMAIL_REGEXP', /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i);

