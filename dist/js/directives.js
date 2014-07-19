'use strict';

// JSON-to-Go, a bomb text coverter utility
// Directives
// 
// 07-MAR-2014 - CSSian 

angular.module( 'JsonToGo.directives', [] )

.directive( 'appVersion', [ 'version',

    function( version ) {
        return function( scope, elm, attrs ) {
            elm.text( version );
        };
    }
] )

.directive( 'animationClass', function( $route ) {

    return {

        link: function( scope, elm, attrs ) {

            var enterClass = $route.current.animate;

            elm.addClass( enterClass );

            scope.$on( '$destroy', function() {
                elm.removeClass( enterClass );
                elm.addClass( $route.current.animate );
            } )
        }
    }
} );