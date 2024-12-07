import {BaseEntity} from '../base/base-entity';
import {ChatMessage} from './message';

export interface Chat extends BaseEntity {
  title: string;
  messages: ChatMessage[];
}
