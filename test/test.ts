/**
 * Created by local-rlong on 09/07/2016.
 */



/// <reference path="../../../typings/Promise.d.ts" />
/// <reference path="../json_broker.ts" />

module test {


    const SERVICE_NAME = "jsonbroker.TestService";

    import IBrokerAdapter = json_broker.IBrokerAdapter;
    import BrokerMessage = json_broker.BrokerMessage;

    export class Proxy {

        adapter: IBrokerAdapter;

        constructor( adapter: IBrokerAdapter ) {

            this.adapter = adapter;
        }

        ping(): Promise<void> {

            let request = json_broker.BrokerMessage.buildRequest( SERVICE_NAME, "ping" );

            return this.adapter.dispatch( request ).then(
                () => {}
            );
        }

    }

}


