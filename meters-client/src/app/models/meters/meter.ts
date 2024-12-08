import {BaseEntity} from '../base/base-entity';
import {MeterType} from './meter-type';

export interface Meter extends BaseEntity {
  type: MeterType;
  value: number;
  date: Date;
  unit?: string;
}
