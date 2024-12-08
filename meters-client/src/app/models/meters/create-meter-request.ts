import {MeterType} from './meter-type';

export interface CreateMeterRequest {
  type: MeterType;
  value: number;
  unit?: string;
}
