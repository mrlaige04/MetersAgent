import {MeterType} from '../meters/meter-type';

export type AllowedIntents = 'SEND' | 'READ' | 'UNKNOWN';

export interface RecogniseResponse {
  success: boolean;
  intent: AllowedIntents;
  params: ParamsForIntent[RecogniseResponse['intent']];
  message: string;
}

export interface ParamsForIntent {
  SEND: IntentSendParams;
  READ: IntentReadParams;
  UNKNOWN: any;
}

export interface IntentSendParams {
  METER_TYPE: MeterType;
  VALUE: number;
}

export interface IntentReadParams {
  METER_TYPE: MeterType;
  START_DATE?: Date;
  END_DATE?: Date;
}
