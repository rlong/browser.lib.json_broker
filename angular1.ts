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


        constructor( $http: angular.IHttpService ) {

            this.$http = $http;
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
