/**
 * Created by local-rlong on 09/07/2016.
 */


/// <reference path="../typings/index.d.ts" />
/// <reference path="lib.json_broker.ts" />



module lib.json_broker.angular1 {

    import BrokerMessage = lib.json_broker.BrokerMessage;

    export namespace http {

        export interface IHttpResponse {
            data: any;
        }

        function post( $http: angular.IHttpService, url: string = "/services" ): angular.IHttpPromise<BrokerMessage> {

            var httpPromise: angular.IHttpPromise<IHttpResponse> = $http.post( url, this.toData() );

            return httpPromise.then(
                (response: IHttpResponse) => { // successCallback
                    return new BrokerMessage( response.data ); // zzz
                }
            );

        }

        // typescript.lib.json_broker.angular1.AngularRequestHandler
        export class RequestHandler implements IRequestHandler {


            $http: angular.IHttpService;
            $q: angular.IQService;


            constructor( $http: angular.IHttpService, $q: angular.IQService) {

                this.$http = $http;
                this.$q = $q;
            }


            dispatch( request: lib.json_broker.BrokerMessage ): Promise<BrokerMessage> {

                var angularPromise: angular.IHttpPromise<IHttpResponse>;
                angularPromise = this.$http.post( "/services", request.toData() );


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


            dispatch( request: lib.json_broker.BrokerMessage ): Promise<BrokerMessage> {

                // map an angular promise to an ES6 promise ...
                let answer = new Promise(

                    ( resolve, reject )  => {

                        var angularPromise: angular.IHttpPromise<IHttpResponse>;
                        angularPromise = this.$http.post( "/services", request.toData() )

                        angularPromise.then(
                            (promiseValue:IHttpResponse) => {

                                let response = new BrokerMessage(promiseValue.data);
                                if( "fault" == response.messageType ) {
                                    reject( response );
                                } else {
                                    resolve( response );
                                }
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

    export namespace embedded {

        import IDeferred = angular.IDeferred;
        class Callback implements lib.json_broker.embedded.ICallback {

            defer: IDeferred<BrokerMessage>;

            constructor( $q: angular.IQService ) {

                this.defer = $q.defer<BrokerMessage>();
            }

            handleResponse( response: BrokerMessage ) {
                this.defer.resolve( response );
            }

            handleFault( fault: BrokerMessage ) {
                this.defer.reject(fault);
            }

        }

        export class RequestHandler implements IRequestHandler {


            $q: angular.IQService;

            constructor( $q: angular.IQService ) {
                this.$q = $q;
            }

            dispatch(request:BrokerMessage): Promise<BrokerMessage> {

                this.$q.defer()

                var callback = new Callback( this.$q );

                lib.json_broker.embedded.dispatch( request, callback );

                return callback.defer.promise;

            }
        }

    }

    export function buildRequestHandler( $http: angular.IHttpService, $q: angular.IQService ): IRequestHandler {

        if( 0 === location.protocol.indexOf("http") ) {
            return new http.RequestHandler( $http, $q );
        }
        return new embedded.RequestHandler( $q );

    }

}
