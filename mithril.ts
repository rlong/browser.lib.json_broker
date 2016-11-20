/**
 * Created by local-rlong on 10/07/2016.
 */


/// <reference path="../../typings/index.d.ts" />
/// <reference path="../../typings/Promise.d.ts" />
/// <reference path="json_broker.ts" />



module json_broker.mithril {

    import BrokerMessage = json_broker.BrokerMessage;

    export module http {

        // typescript.lib.json_broker.angular1.MithrilRequestHandler
        export class RequestHandler implements IRequestHandler {

            dispatch( request:BrokerMessage ): Promise<BrokerMessage> {

                // map an mithril promise to an ES6 promise ...
                let answer = new Promise(
                    ( resolve, reject )  => {


                        m.request( {data: request.toArray(), method: "POST", url: "/services"}).then(
                            (promiseValue) => {

                                console.log( promiseValue);

                                let response = new BrokerMessage(promiseValue);
                                if( "fault" == response.messageType ) {
                                    reject( response );
                                } else {
                                    resolve( response );
                                }
                            },
                            (reason) => {
                                console.error( reason );
                                reject( reason );
                            }
                        )
                    }
                );

                return answer;

            }
        }
    }


    export module embedded {

        class Callback implements json_broker.embedded.ICallback {

            promise: Promise<BrokerMessage> = null;
            resolve = null;
            reject = null;

            constructor() {

                this.promise = new Promise(
                    (resolve, reject ) => {
                        this.resolve = resolve;
                        this.reject = reject;
                    }
                );
            }

            handleResponse( response: BrokerMessage ) {
                this.resolve( response );
            }

            handleFault( fault: BrokerMessage ) {
                this.reject( fault );
            }
        }
    }


    export function buildRequestHandler() {

        return new http.RequestHandler();

    }

}
