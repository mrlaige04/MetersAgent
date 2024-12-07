import {BaseEntity} from '../base/base-entity';

export interface ChatMessage extends BaseEntity {
  contentHtml: string;
  isSystem: boolean;
  chatId: number;
}
