/**
 * Created by local-rlong on 09/07/2016.
 */



/// <reference path="../../typings/Promise.d.ts" />
/// <reference path="../typescript.lib.json_broker.ts" />

module typescript.lib.json_broker.service.test {


    const SERVICE_NAME = "jsonbroker.TestService";

    import IRequestHandler = typescript.lib.json_broker.IRequestHandler;
    import BrokerMessage = typescript.lib.json_broker.BrokerMessage;

    export class TestProxy {

        requestHandler: IRequestHandler;

        constructor( requestHandler: IRequestHandler ) {

            this.requestHandler = requestHandler;
        }

        ping(): Promise<void> {

            let request = new typescript.lib.json_broker.BrokerMessage();
            request.serviceName = SERVICE_NAME;
            request.methodName = "ping";

            return this.requestHandler.dispatch( request ).then(
                () => {}
            );

        }

    }

}


