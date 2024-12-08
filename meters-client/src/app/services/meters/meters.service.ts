import {inject, Injectable} from '@angular/core';
import {BaseBackendClient} from '../../common/http/base-backend-client';
import {CreateMeterRequest} from '../../models/meters/create-meter-request';
import {Success} from '../../models/base/success';
import {MeterType} from '../../models/meters/meter-type';
import {HttpParams} from '@angular/common/http';
import {Meter} from '../../models/meters/meter';

@Injectable({
  providedIn: 'root'
})
export class MetersService {
  private baseClient = inject(BaseBackendClient);
  private readonly prefix = 'meters';

  createMeter(request: CreateMeterRequest) {
    const url = `${this.prefix}`;
    return this.baseClient.post<any, Success>(url, {
      type: MeterType[request.type],
      value: request.value,
      unit: request.unit
    });
  }

  getMeters(type: MeterType, start?: Date, end?: Date)  {
    const url = `${this.prefix}`;
    let params = new HttpParams()
      .set('type', MeterType[type]);

    if (start) params = params.set('start', start.toISOString());
    if (end) params = params.set('end', end.toISOString());

    return this.baseClient.get<Meter[]>(url, params);
  }
}
