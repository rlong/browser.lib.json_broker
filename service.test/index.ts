/**
 * Created by rlong on 13/03/2016.
 */

/// <reference path="../../typings/index.d.ts" />
/// <reference path="../typescript.lib.json_broker.ts" />
/// <reference path="../angular1.ts" />
/// <reference path="service.test.ts" />





import AngularRequestHandler = typescript.lib.json_broker.angular1.AngularRequestHandler;
import BrokerMessage = typescript.lib.json_broker.BrokerMessage;
import TestProxy = typescript.lib.json_broker.service.test.TestProxy;


class ViewController {


    proxy: TestProxy;

    constructor( $http: angular.IHttpService ) {


        let requestHandler = new AngularRequestHandler($http);
        this.proxy = new TestProxy(requestHandler);

    }

    ping() {

        console.log( arguments );
        this.proxy.ping().then(
            (response ) => { // successCallback
                console.log( response );
            }
            , (response ) => { // errorCallback
                console.error( response );
            }
        )
    }

}


var mcRemote= angular.module('service.test', []);

mcRemote.controller('index', ["$scope", "$http", function ($scope,$http) {


    $scope.variable = "hey hey (from angular)";

    $scope.viewController = new ViewController( $http );
    $scope.viewController.ping();


}]);


