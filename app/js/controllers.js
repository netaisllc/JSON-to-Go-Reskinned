'use strict';

// JSON-to-Go, a bomb text coverter utility
// CONTROLLERS
//
// 16-JUL-2014 - CSSian
//

angular.module( 'JsonToGo.controllers', [] )
    .controller( 'MainCtrl', [

        '$scope',
        'DemoService',
        'Converter',

        function( $scope, demo, converter ) {

            $scope.goTypeName = null;
            $scope.jsonCode = null;
            $scope.goCode = null;

            $scope.error = {
                goTypeName: null,
                jsonCode: null
            };
            $scope.show = {
                JSONPanel: true,
                GoPanel: false
            };

            // Define Features
            // - name:        UI string, dislayed name of feature
            // - sort:        UI position, left-to-right display order, 1 = most-left
            // - selected:    UI state; is the feature selected now
            // - action:      UI behavior, function executed on click of feature
            //
            $scope.features = [ {
                'name': 'JSON',
                'selected': true,
                'sequence': 0,
                'action': function( feature ) {
                    $scope.showJsonPanel();
                }
            }, {
                'name': 'Golang',
                'selected': false,
                'sequence': 1,
                'action': function( feature ) {
                    $scope.showGoPanel();
                }
            } ];

            $scope.clear = function() {
                $scope.goTypeName = "";
                $scope.jsonCode = "";
                $scope.goCode = "";
            };

            $scope.clearClass = function() {
                var el = angular.element( 'button' );
                console.log( el );
            }

            $scope.convert = function() {
                if ( $scope.goTypeName && $scope.jsonCode ) {
                    $scope.goCode = converter.jsonToGo( $scope.jsonCode, $scope.goTypeName );
                    $scope.showGoPanel();
                };
            };

            $scope.deselect = function( ary ) {
                // Set UI selection state to false for every element in the collection
                var a = _.forEach( ary, function( object ) {
                    object.selected = false;
                } );
                return a;
            };

            $scope.loadDemoData = function() {
                // Retrieve the demo data and populate to UI models
                $scope.goTypeName = demo.getType();
                $scope.jsonCode = demo.getData();
                $scope.showJsonPanel();
            };

            $scope.reset = function() {
                $scope.clear();
                $scope.showJsonPanel();
            };

            $scope.selectFeature = function( n ) {
                // React to a ui state change where 'n' is
                // and int { 0, 1 }
                var i = n || 0;
                $scope.deselect( $scope.features );
                $scope.features[ i ].selected = true;
            };

            $scope.showGoPanel = function() {
                $scope.selectFeature( 1 );
                $scope.show.GoPanel = true;
                $scope.show.JSONPanel = false;
            };

            $scope.showJsonPanel = function() {
                $scope.selectFeature( 0 );
                $scope.show.GoPanel = false;
                $scope.show.JSONPanel = true;
            };
        }
    ] );