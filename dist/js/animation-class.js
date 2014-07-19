'use strict';

/* Directives */

var animationClass = angular.module( "animationClass", [] );

/**
 * AnimationClass
 * - http://stackoverflow.com/questions/21211460/route-dependent-css-page-transitions-in-angularjs
 *
 */

Lims.directive( 'animationClass', function( $route ) {

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