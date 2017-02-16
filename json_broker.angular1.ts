/**
 * Created by local-rlong on 09/07/2016.
 */


/// <reference path="../../typings/index.d.ts" />



module json_broker.angular1 {

    import BrokerMessage = json_broker.BrokerMessage;
    import IRequestHandler = json_broker.IRequestHandler;

    // export function post( $http: angular.IHttpService, request: json_broker.BrokerMessage, url: string = "/services" ): angular.IHttpPromise<BrokerMessage> {
    //
    //
    //     var httpPromise: angular.IHttpPromise<IHttpResponse> = $http.post( url, request.toData() );
    //
    //     return httpPromise.then(
    //         (response: IHttpResponse) => { // successCallback
    //             return new json_broker.BrokerMessage( response.data ); // zzz
    //         }
    //     );
    // }

    interface IHttpResponse {
        data: any;
    }


    export class BrokerAdapter implements json_broker.IBrokerAdapter {

        $http: angular.IHttpService;
        $q: angular.IQService;

        constructor( $http: angular.IHttpService, $q: angular.IQService) {

            this.$http = $http;
            this.$q = $q;
        }

        dispatch( request: json_broker.BrokerMessage ): angular.IPromise<json_broker.BrokerMessage> {


            var angularPromise: angular.IHttpPromise<IHttpResponse>;
            angularPromise = this.$http.post( "/services", request.toData() );


            let answer: any = angularPromise.then( // hacky, but works
                (promiseValue:IHttpResponse) => {

                    let response = new json_broker.BrokerMessage(promiseValue.data);
                    return response;
                }
            );

            return answer;
        }

        reject(): angular.IPromise<any> {
            return this.$q.reject()
        }

        resolve<T>(value: angular.IPromise<T>|T) : angular.IPromise<T> {
            return this.$q.resolve<T>(value);
        }

    }



    // export namespace http {
    //
    //     export interface IHttpResponse {
    //         data: any;
    //     }
    //
    //     function post( $http: angular.IHttpService, request: json_broker.BrokerMessage, url: string = "/services" ): angular.IHttpPromise<BrokerMessage> {
    //
    //         var httpPromise: angular.IHttpPromise<IHttpResponse> = $http.post( url, request.toData() );
    //
    //         return httpPromise.then(
    //             (response: IHttpResponse) => { // successCallback
    //                 return new json_broker.BrokerMessage( response.data ); // zzz
    //             }
    //         );
    //     }
    //
    //
    //     // json_broker.angular1.http.RequestHandler
    //     export class RequestHandler implements json_broker.IRequestHandler {
    //
    //
    //         $http: angular.IHttpService;
    //         $q: angular.IQService;
    //
    //
    //         constructor( $http: angular.IHttpService, $q: angular.IQService) {
    //
    //             this.$http = $http;
    //             this.$q = $q;
    //         }
    //
    //
    //         dispatch( request: json_broker.BrokerMessage ): angular.IPromise<json_broker.BrokerMessage> {
    //
    //             var angularPromise: angular.IHttpPromise<IHttpResponse>;
    //             angularPromise = this.$http.post( "/services", request.toData() );
    //
    //
    //             let answer: any = angularPromise.then( // hacky, but works
    //                 (promiseValue:IHttpResponse) => {
    //
    //                     let response = new json_broker.BrokerMessage(promiseValue.data);
    //                     return response;
    //                 }
    //             );
    //
    //             return answer;
    //         }
    //     }
    //
    // }

    export namespace embedded {

        import IDeferred = angular.IDeferred;
        class Callback implements json_broker.embedded.ICallback {

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

            dispatch(request:BrokerMessage): angular.IPromise<BrokerMessage> {

                this.$q.defer()

                var callback = new Callback( this.$q );

                json_broker.embedded.dispatch( request, callback );

                return callback.defer.promise;

            }
        }
    }

    // export function buildRequestHandler( $http: angular.IHttpService, $q: angular.IQService ): IRequestHandler {
    //
    //     if( 0 === location.protocol.indexOf("http") ) {
    //         return new http.RequestHandler( $http, $q );
    //     }
    //     return new embedded.RequestHandler( $q );
    //
    // }


    export function buildBrokerAdapter( $http: angular.IHttpService, $q: angular.IQService ): IBrokerAdapter {

        return new BrokerAdapter( $http, $q );
    }

}
