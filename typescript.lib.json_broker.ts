/**
 * Created by rlong on 12/03/2016.
 */



/// <reference path="../typings/index.d.ts" />
/// <reference path="../typings/Promise.d.ts" />


 module typescript.lib.json_broker {
//module typescript {
//    export module lib {
//        export module json_broker {


            export class BrokerMessage {

                messageType:string = "request"; // 'request'/'response'/'event'
                metaData:any = {};
                serviceName:string = "__SERVICE_NAME__";
                majorVersion:number = 1;
                minorVersion:number = 0;
                methodName:string = "__METHOD_NAME__";
                associativeParamaters:any = {};
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
                            this.associativeParamaters = params;
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
                    answer[6] = this.associativeParamaters;
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

    //    }
    //}
}


