/**
 * Created by local-rlong on 09/07/2016.
 */



/// <reference path="../../typings/Promise.d.ts" />
/// <reference path="../lib.json_broker.ts" />

module lib.json_broker.service.test {


    const SERVICE_NAME = "jsonbroker.TestService";

    import IRequestHandler = lib.json_broker.IRequestHandler;
    import BrokerMessage = lib.json_broker.BrokerMessage;

    export class TestProxy {

        requestHandler: IRequestHandler;

        constructor( requestHandler: IRequestHandler ) {

            this.requestHandler = requestHandler;
        }

        ping(): Promise<void> {

            let request = lib.json_broker.BrokerMessage.buildRequest( SERVICE_NAME, "ping" );

            return this.requestHandler.dispatch( request ).then(
                () => {}
            );

        }

    }

}


