/**
 * Created by local-rlong on 24/07/2016.
 */


/// <reference path="../../typings/Promise.d.ts" />
/// <reference path="json_broker.ts" />

module json_broker.vanilla {


    import BrokerMessage = json_broker.BrokerMessage;

    export module http {

        export class RequestHandler implements IRequestHandler {

            dispatch( request:BrokerMessage ): Promise<BrokerMessage> {


                var httpRequest = new XMLHttpRequest();

                let answer = new Promise<BrokerMessage>(function(resolve, reject) {

                    httpRequest.onreadystatechange = () => {

                        if (httpRequest.readyState != 4) {
                            return;
                        }

                        if (200 === httpRequest.status) {

                            let poja: any[] = JSON.parse(this.responseText);
                            let message = new BrokerMessage( poja );
                            if( "response" == message.messageType ) {
                                resolve( message );
                            } else if( "fault" == message.messageType ) {
                                reject( message );
                            }
                        }
                        // else drop through and assume a fault ...

                        let fault = new BrokerMessage();
                        fault.messageType = "fault"; // [0]
                        fault.metaData = request.metaData;
                        fault.serviceName = request.serviceName;
                        fault.majorVersion = request.majorVersion;
                        fault.minorVersion = request.minorVersion;
                        fault.methodName = request.methodName;

                        let associativeParameters = {};
                        associativeParameters["errorDomain"] =  "RequestHandler." + httpRequest.status; // old
                        associativeParameters["faultCode"] =  httpRequest.status; // old
                        associativeParameters["faultContext"] = {"readyState":httpRequest.readyState}; // old
                        associativeParameters["faultMessage"] = httpRequest.statusText; // old

                        associativeParameters["entity"] = RequestHandler.faultCodeStringToNumber("xhrq"); // the 'thing' associated with the fault
                        associativeParameters["issue"] = RequestHandler.faultCodeStringToNumber("" + httpRequest.status ); // the 'thing' associated with the fault
                        associativeParameters["context"] = {"readyState":httpRequest.readyState};
                        associativeParameters["message"] = httpRequest.statusText;
                        associativeParameters["originator"] = "lib.json_broker.vanilla.http.RequestHandler.dispatch";
                        associativeParameters["stackTrace"] = [];
                        associativeParameters["underlyingFaultMessage"] =  null;

                        fault.associativeParameters = associativeParameters;
                        reject( fault );

                    }
                });

                httpRequest.open( "POST", "/services"); // implicitely async
                //xmlhttp.open( "POST", "/services", false); // explicitly sync

                httpRequest.send( request.toData() ); //send request

                return answer;


            }

            // returns a 32-bit unsigned number based on the first 4 characters of the 'input'
            static faultCodeStringToNumber( input: string ): number {

                var answer = 0;

                for( var index = 0; index < 4 && index < input.length; index++ ) {
                    if( index != 0 ) {
                        answer <<= 8; // shift by 8 bits
                    }
                    index |= input.charCodeAt( index );
                }

                return answer;
            }
        }

    }

    export module embedded {

        class Callback implements lib.json_broker.embedded.ICallback {

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
                this.resolve( fault );
            }
        }


        export class RequestHandler implements IRequestHandler {


            dispatch(request:BrokerMessage): Promise<BrokerMessage> {

                var callback = new Callback();
                lib.json_broker.embedded.dispatch( request, callback );

                return callback.promise;

            }
        }

    }


    export function buildRequestHandler() {

        if( 0 === location.protocol.indexOf("http") ) {
            return new http.RequestHandler();
        } else {
            return new embedded.RequestHandler();
        }

    }


}