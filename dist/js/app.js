'use strict';

// JSON-to-Go, a bomb text coverter utility
// 07-MAR-2014 - CSSian

// Declare app level module which depends on filters, and services
var JTG = angular.module( 'JsonToGo', [
    'ngAnimate',
    'ngRoute',
    'JsonToGo.controllers',
    'JsonToGo.directives',
    'JsonToGo.filters',
    'JsonToGo.services'
] );


JTG.config( [ '$routeProvider',

    function( $routeProvider ) {

        $routeProvider

        .when( '/', {
            animate: 'slideLeft',
            controller: 'MainCtrl',
            templateUrl: 'partials/home.html'
        } )

        .otherwise( {
            redirectTo: '/'
        } );
    }
] );