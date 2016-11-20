/**
 * Created by local-rlong on 09/07/2016.
 */



/// <reference path="../../../typings/Promise.d.ts" />
/// <reference path="../json_broker.ts" />

module json_broker.service.test {


    const SERVICE_NAME = "jsonbroker.TestService";

    import IRequestHandler = json_broker.IRequestHandler;
    import BrokerMessage = json_broker.BrokerMessage;

    export class TestProxy {

        requestHandler: IRequestHandler;

        constructor( requestHandler: IRequestHandler ) {

            this.requestHandler = requestHandler;
        }

        ping(): Promise<void> {

            let request = json_broker.BrokerMessage.buildRequest( SERVICE_NAME, "ping" );

            return this.requestHandler.dispatch( request ).then(
                () => {}
            );

        }

    }

}


