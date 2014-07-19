'use strict';

// JSON-to-Go, a bomb text coverter utility
// Directives
//
// 07-MAR-2014 - CSSian

var JTGServices = angular.module( 'JsonToGo.services', [] );

JTGServices.value( 'version', '1.0' );

JTGServices.factory( 'DemoService',

    function() {

        var _data =
            '[\n' +
            '    {\n' +
            '        "input_index": 0,\n' +
            '        "candidate_index": 0,\n' +
            '        "addressee": "Apple Inc",\n' +
            '        "delivery_line_1": "1 Infinite Loop",\n' +
            '        "delivery_line_2": "PO Box 42",\n' +
            '        "last_line": "Cupertino CA 95014-2083",\n' +
            '        "delivery_point_barcode": "950142083017",\n' +
            '        "components": {\n' +
            '            "primary_number": "1",\n' +
            '            "street_name": "Infinite",\n' +
            '            "street_suffix": "Loop",\n' +
            '            "city_name": "Cupertino",\n' +
            '            "state_abbreviation": "CA",\n' +
            '            "zipcode": "95014",\n' +
            '            "plus4_code": "2083",\n' +
            '            "delivery_point": "01",\n' +
            '           "delivery_point_check_digit": "7"\n' +
            '        },\n' +
            '        "metadata": {\n' +
            '            "record_type": "S",\n' +
            '            "county_fips": "06085",\n' +
            '            "county_name": "Santa Clara",\n' +
            '            "carrier_route": "C067",\n' +
            '            "congressional_district": "15",\n' +
            '            "rdi": "Commercial",\n' +
            '            "latitude": 37.33118,\n' +
            '            "longitude": -122.03062,\n' +
            '            "precision": "Zip9"\n' +
            '        },\n' +
            '        "analysis": {\n' +
            '            "dpv_match_code": "Y",\n' +
            '            "dpv_footnotes": "AABB",\n' +
            '            "dpv_cmra": "N",\n' +
            '            "dpv_vacant": "N",\n' +
            '            "active": "Y"\n' +
            '        }\n' +
            '    },\n' +
            '    {\n' +
            '        "input_index": 0,\n' +
            '        "candidate_index": 0,\n' +
            '        "addressee": "Apple Inc",\n' +
            '        "delivery_line_1": "1 Infinite Loop",\n' +
            '        "delivery_line_2": "PO Box 42",\n' +
            '        "last_line": "Cupertino CA 95014-2083",\n' +
            '        "delivery_point_barcode": "950142083017",\n' +
            '        "components": {\n' +
            '            "primary_number": "1",\n' +
            '            "street_name": "Infinite",\n' +
            '            "street_suffix": "Loop",\n' +
            '            "city_name": "Cupertino",\n' +
            '            "state_abbreviation": "CA",\n' +
            '            "zipcode": "95014",\n' +
            '            "plus4_code": "2083",\n' +
            '            "delivery_point": "01",\n' +
            '            "delivery_point_check_digit": "7"\n' +
            '        },\n' +
            '        "metadata": {\n' +
            '            "record_type": "S",\n' +
            '            "county_fips": "06085",\n' +
            '            "county_name": "Santa Clara",\n' +
            '            "carrier_route": "C067",\n' +
            '            "congressional_district": "15",\n' +
            '            "rdi": "Commercial",\n' +
            '            "latitude": 37.33118,\n' +
            '            "longitude": -122.03062,\n' +
            '            "precision": "Zip9"\n' +
            '        },\n' +
            '        "analysis": {\n' +
            '            "dpv_match_code": "Y",\n' +
            '            "dpv_footnotes": "AABB",\n' +
            '            "dpv_cmra": "N",\n' +
            '            "dpv_vacant": "N",\n' +
            '            "active": "Y"\n' +
            '        }\n' +
            '    }\n' +
            ']';
        var _type = "valid_addresses";

        return {

            getData: function() {
                return _data;
            },

            getType: function() {
                return _type;
            }
        };
    }
);

JTGServices.factory( 'Converter',

    function() {

        var _jsonToGo = function( json, typename ) {

            var data;
            var scope;
            var go = "";
            var tabs = 0;

            try {
                data = JSON.parse( json );
                scope = data;
            } catch ( e ) {
                return {
                    go: "",
                    error: e.message
                };
            }

            typename = format( typename );

            if ( !typename )
                typename = "GIVE_ME_A_NAME";

            append( "type " + typename + " " );

            parseScope( scope );

            return {
                go: go
            };

            function parseScope( scope ) {
                if ( typeof scope === "object" && scope !== null ) {
                    if ( Array.isArray( scope ) ) {
                        var sliceType;
                        for ( var i = 0; i < scope.length; i++ ) {
                            var thisType = goType( scope[ i ] );
                            if ( !sliceType )
                                sliceType = thisType;
                            else if ( sliceType != thisType ) {
                                sliceType = mostSpecificPossibleGoType( thisType, sliceType );
                                if ( sliceType == "interface{}" )
                                    break;
                            }
                        }
                        append( "[]" );
                        if ( sliceType == "struct" )
                            parseScope( scope[ 0 ] );
                        else
                            append( sliceType || "interface{}" );
                    } else {
                        append( "struct {\n" );
                        ++tabs;
                        var keys = Object.keys( scope );
                        for ( var i in keys ) {
                            var keyname = keys[ i ];
                            indent( tabs );
                            append( format( keyname ) + " " );
                            parseScope( scope[ keyname ] );
                            append( ' `json:"' + keyname + '"`\n' );
                        }
                        indent( --tabs );
                        append( "}" );
                    }
                } else
                    append( goType( scope ) );
            }

            function indent( tabs ) {
                for ( var i = 0; i < tabs; i++ )
                    go += '\t';
            }

            function append( str ) {
                go += str;
            }

            function format( str ) {
                if ( str.match( /^\d+$/ ) )
                    str = "Number" + str;
                else if ( str.charAt( 0 ).match( /\d/ ) ) {
                    var numbers = {
                        '0': "Zero_",
                        '1': "One_",
                        '2': "Two_",
                        '3': "Three_",
                        '4': "Four_",
                        '5': "Five_",
                        '6': "Six_",
                        '7': "Seven_",
                        '8': "Eight_",
                        '9': "Nine_"
                    };
                    str = numbers[ str.charAt( 0 ) ] + str.substr( 1 );
                }
                return toProperCase( str ).replace( /\s|_/g, "" );
            }

            function goType( val ) {
                if ( val === null )
                    return "interface{}";

                switch ( typeof val ) {
                    case "string":
                        if ( /\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\+\d\d:\d\d/.test( val ) )
                            return "time.Time";
                        else
                            return "string";
                    case "number":
                        if ( val % 1 === 0 ) {
                            if ( val > -2147483648 && val < 2147483647 )
                                return "int"
                            else
                                return "int64"
                        } else
                            return "float32"
                    case "boolean":
                        return "bool";
                    case "object":
                        return "struct";
                    case "array":
                        return "slice";
                    default:
                        return "interface{}";
                }
            }

            function mostSpecificPossibleGoType( typ1, typ2 ) {
                if ( typ1.substr( 0, 5 ) == "float" && typ2.substr( 0, 3 ) == "int" )
                    return typ1;
                else if ( typ1.substr( 0, 3 ) == "int" && typ2.substr( 0, 5 ) == "float" )
                    return typ1;
                else
                    return "interface{}";
            }

            function toProperCase( str ) {
                if ( str.length == 0 )
                    return "";

                str = str.charAt( 0 ).toUpperCase() + str.substr( 1 );

                return str.replace( /[\s_][a-z]+/g, function( txt ) {
                    return txt.charAt( 0 ) + txt.charAt( 1 ).toUpperCase() + txt.substr( 2 ).toLowerCase();
                } );
            }
        };

        return {

            jsonToGo: function( json, typename ) {

                var _results;
                _results = _jsonToGo( json, typename );
                if ( _results.go > " " ) {

                    return _results.go;

                } else {

                    return 'Conversion failed with ERROR: ' + _results.error
                };
            }
        };
    }
);