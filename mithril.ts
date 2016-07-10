/**
 * Created by local-rlong on 10/07/2016.
 */



/// <reference path="../typings/index.d.ts" />
/// <reference path="../typings/Promise.d.ts" />
/// <reference path="typescript.lib.json_broker.ts" />


module typescript.lib.json_broker.mithril {

    import BrokerMessage = typescript.lib.json_broker.BrokerMessage;

    // typescript.lib.json_broker.angular1.MithrilRequestHandler
    export class MithrilRequestHandler implements IRequestHandler {

        dispatch( request:BrokerMessage ): Promise<BrokerMessage> {

            // map an mithril promise to an ES6 promise ...
            let answer = new Promise(
                ( resolve, reject )  => {


                    m.request( {data: request.toArray(), method: "POST", url: "/services"}).then(
                        (promiseValue) => {

                            console.log( promiseValue);

                            let response = new BrokerMessage(promiseValue);

                            resolve( response );

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
