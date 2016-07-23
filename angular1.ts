/**
 * Created by local-rlong on 09/07/2016.
 */


/// <reference path="../typings/index.d.ts" />
/// <reference path="typescript.lib.json_broker.ts" />



module typescript.lib.json_broker.angular1 {

    export interface IHttpResponse {
        data: any;
    }

    import BrokerMessage = typescript.lib.json_broker.BrokerMessage;

    function post( $http: angular.IHttpService, url: string = "/services" ): angular.IHttpPromise<BrokerMessage> {

        var httpPromise: angular.IHttpPromise<IHttpResponse> = $http.post( url, this.toData() );

        return httpPromise.then(
            (response: IHttpResponse) => { // successCallback
                return new BrokerMessage( response.data ); // zzz
            }
        );

    }

    // typescript.lib.json_broker.angular1.AngularRequestHandler
    export class AngularRequestHandler implements IRequestHandler {


        $http: angular.IHttpService;
        $q: angular.IQService;


        constructor( $http: angular.IHttpService, $q: angular.IQService) {

            this.$http = $http;
            this.$q = $q;
        }


        dispatch( request: typescript.lib.json_broker.BrokerMessage ): Promise<BrokerMessage> {

            var angularPromise: angular.IHttpPromise<IHttpResponse>;
            angularPromise = this.$http.post( "/services", request.toData() )


            let answer: any = angularPromise.then( // hacky, but works
                (promiseValue:IHttpResponse) => {

                    let response = new BrokerMessage(promiseValue.data);
                    return response;
                }
            );

            return answer;

        }

    }


    // typescript.lib.json_broker.angular1.AngularRequestHandler
    export class AngularRequestHandler2 implements IRequestHandler {

        $http: angular.IHttpService;
        $q: angular.IQService;
        $scope: angular.IScope;


        constructor( $http: angular.IHttpService, $q: angular.IQService, $scope: angular.IScope ) {

            console.warn( "AngularRequestHandler2 is broken ... Promise callbacks are not called within a $digest()");
            this.$http = $http;
            this.$q = $q;
            this.$scope = $scope;

        }


        dispatch( request: typescript.lib.json_broker.BrokerMessage ): Promise<BrokerMessage> {

            // map an angular promise to an ES6 promise ...
            let answer = new Promise(

                ( resolve, reject )  => {

                    var angularPromise: angular.IHttpPromise<IHttpResponse>;
                    angularPromise = this.$http.post( "/services", request.toData() )

                    angularPromise.then(
                        (promiseValue:IHttpResponse) => {

                            let response = new BrokerMessage(promiseValue.data);
                            resolve( response );

                        },
                        ( reason ) => {
                            reject( reason );
                        }
                    )
                }
            );

            return answer;

        }


    }


}
