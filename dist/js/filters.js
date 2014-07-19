'use strict';

// JSON-to-Go, a bomb text coverter utility
// Directives
// 
// 07-MAR-2014 - CSSian

angular.module( 'JsonToGo.filters', [] ).
filter( 'interpolate', [ 'version',
    function( version ) {
        return function( text ) {
            return String( text ).replace( /\%VERSION\%/mg, version );
        }
    }
] );