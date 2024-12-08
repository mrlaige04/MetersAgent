import {inject, Injectable} from '@angular/core';
import {MetersService} from '../meters/meters.service';
import {IntentReadParams, IntentSendParams, ParamsForIntent} from '../../models/llm/recognise-response';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LlmCommandExecutor {
  private metersService = inject(MetersService);

  private intentMap = new Map<string, (request: any) => Observable<any>>();
  constructor() {
    this.intentMap.set('SEND', this.processSend.bind(this));
    this.intentMap.set('READ', this.processRead.bind(this));
  }

  processSend(request: IntentSendParams) {
    return this.metersService.createMeter({
      type: request.METER_TYPE,
      value: request.VALUE,
      unit: request.UNIT
    });
  }

  processRead(request: IntentReadParams) {
    return this.metersService.getMeters(request.METER_TYPE, request.START_DATE, request.END_DATE);
  }

  executeIntent(intent: string, request: any) {
    const handler = this.intentMap.get(intent);
    if (handler) {
      return handler(request);
    }

    return null;
  }
}
