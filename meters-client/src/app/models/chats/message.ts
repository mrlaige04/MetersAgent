import {BaseEntity} from '../base/base-entity';
import {User} from '../users/user';

export interface ChatMessage extends BaseEntity {
  text: string;
  user: User;
}
