/**
 * Created by rlong on 13/03/2016.
 */

/// <reference path="../../typings/index.d.ts" />
/// <reference path="../typescript.lib.json_broker.ts" />
/// <reference path="../angular1.ts" />
/// <reference path="service.test.ts" />



import AngularRequestHandler = typescript.lib.json_broker.angular1.AngularRequestHandler;
import AngularRequestHandler2 = typescript.lib.json_broker.angular1.AngularRequestHandler2;
import BrokerMessage = typescript.lib.json_broker.BrokerMessage;
import TestProxy = typescript.lib.json_broker.service.test.TestProxy;


class ViewController {


    proxy: TestProxy;
    $scope: angular.IScope;

    constructor( $http: angular.IHttpService, $q: angular.IQService, $scope: angular.IScope ) {

        let requestHandler = new AngularRequestHandler( $http, $q);
        //let requestHandler = new AngularRequestHandler2( $http, $q, $scope);
        this.proxy = new TestProxy(requestHandler);
        this.$scope = $scope;
    }


    ping() {

        console.log( arguments );
        this.proxy.ping().then(
            (response ) => { // successCallback

                if(!this.$scope.$$phase) {
                    console.warn( "!this.$scope.$$phase" );
                }
                console.log( response );

            }
            , (response ) => { // errorCallback
                console.error( response );
            }
        )
    }

}


var mcRemote= angular.module('service.test', []);

mcRemote.controller('index', ["$http", "$q", "$scope", function ($http: angular.IHttpService, $q: angular.IQService, $scope) {


    $scope.variable = "hey hey (from angular)";

    $scope.viewController = new ViewController( $http, $q, $scope );
    $scope.viewController.ping();


}]);


