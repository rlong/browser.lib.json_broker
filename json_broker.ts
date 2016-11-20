/**
 * Created by rlong on 12/03/2016.
 */



/// <reference path="../../typings/index.d.ts" />
/// <reference path="../../typings/Promise.d.ts" />


 module json_broker {

     export class BrokerMessage {

         messageType:string = "request"; // 'fault'/'oneway'/'request'/'response'/'event'
         metaData:any = {};
         serviceName:string = "__SERVICE_NAME__";
         majorVersion:number = 1;
         minorVersion:number = 0;
         methodName:string = "__METHOD_NAME__";
         associativeParameters:any = {};
         orderedParamaters:any[];

         constructor(poja?:any[]) { // poja: plain old javascript array
             if (poja) {
                 this.messageType = poja[0];
                 this.metaData = poja[1];
                 this.serviceName = poja[2];
                 this.majorVersion = poja[3];
                 this.minorVersion = poja[4];
                 this.methodName = poja[5];
                 let params = poja[6];
                 if (Array.isArray(params)) {
                     this.orderedParamaters = params;
                 } else {
                     this.associativeParameters = params;
                 }
             }
         }


         public static buildRequest( serviceName: string, methodName: string ): BrokerMessage {

             let answer: BrokerMessage = new BrokerMessage();
             answer.serviceName = serviceName;
             answer.methodName = methodName;
             return answer;

         }

         toArray():any[] {
             var answer = new Array(6);
             answer[0] = this.messageType;
             answer[1] = this.metaData;
             answer[2] = this.serviceName;
             answer[3] = this.majorVersion;
             answer[4] = this.minorVersion;
             answer[5] = this.methodName;
             answer[6] = this.associativeParameters;
             if (this.orderedParamaters) {
                 answer[6] = this.orderedParamaters;
             }
             return answer;
         }

         toData():any {
             return JSON.stringify(this.toArray());
         }

     }

     export interface IRequestHandler {
         dispatch(request:BrokerMessage): Promise<BrokerMessage>;
     }

     export module embedded {

         export interface ICallback {
             handleResponse( response: BrokerMessage );
             handleFault( fault: BrokerMessage );
         }

         var callbackId = 1;
         var pendingCallbacks: { [callbackId: number]: ICallback; } = { };


         export function dispatch(request:BrokerMessage, callback: ICallback ): void {

             request.metaData["callbackId"] = callbackId;
             pendingCallbacks[callbackId] = callback;
             callbackId++;


             var call = "jsonbroker:" + request.toData();

             // vvv http://blog.techno-barje.fr/post/2010/10/06/UIWebView-secrets-part3-How-to-properly-call-ObjectiveC-from-Javascript

             var iframe = document.createElement("IFRAME");
             iframe.setAttribute( "src", call );
             document.documentElement.appendChild(iframe);
             iframe.parentNode.removeChild(iframe);
             iframe = null;

             // ^^^ http://blog.techno-barje.fr/post/2010/10/06/UIWebView-secrets-part3-How-to-properly-call-ObjectiveC-from-Javascript

         }

         // returns null when there is no issues
         export function handleFault( response: BrokerMessage ): string {

             let callbackId: number = response.metaData["callbackId"];
             if( !callbackId ) {
                 console.error( response );
                 return "!callbackId";
             }

             let callback = pendingCallbacks[callbackId];
             if( !callback ) {
                 console.error( response );
                 return "!callback; callbackId = " + callbackId;
             }

             callback.handleFault( response );
             delete pendingCallbacks[callbackId]; // cleanup
             return null;
         }


         // returns null when there is no issues
         export function handleResponse( response: BrokerMessage ): string {

             let callbackId: number = response.metaData["callbackId"];
             if( !callbackId ) {
                 console.error( response );
                 return "!callbackId";
             }

             let callback = pendingCallbacks[callbackId];
             if( !callback ) {
                 console.error( response );
                 return "!callback; callbackId = " + callbackId;
             }

             callback.handleResponse( response );
             delete pendingCallbacks[callbackId]; // cleanup
             return null;
         }

     }

     export module fault {


         // lib.json_broker.fault.numberFaultCodeToString( 560361060 );
         export function numberFaultCodeToString( faultCode: number ) {

             var answer = "";
             while( 0 < faultCode ) {

                 let asciiCode = faultCode & 0xFF;
                 // console.log( asciiCode );
                 answer = String.fromCharCode(asciiCode) + answer;

                 faultCode >>= 8;
             }

             return answer;
         }



         // lib.json_broker.fault.stringFaultCodeToNumber( '!fnd' );
         export function stringFaultCodeToNumber(  faultCode: string ) {

             var answer: number = 0;

             for( var index = 0; index < faultCode.length; index++ ) {

                 answer <<= 8;
                 answer |= faultCode.charCodeAt( index );
             }

             return answer;
         }
     }



 }



