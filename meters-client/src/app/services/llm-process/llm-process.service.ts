import {inject, Injectable} from '@angular/core';
import {BaseTextProcessorClient} from '../../common/http/base-text-processor-client';
import {RecogniseRequest} from '../../models/llm/recognise-request';
import {RecogniseResponse} from '../../models/llm/recognise-response';

@Injectable({
  providedIn: 'root'
})
export class LLMProcessService {
  private baseClient = inject(BaseTextProcessorClient);

  recognise(request: RecogniseRequest) {
    const url = 'process-message';
    return this.baseClient.post<RecogniseRequest, RecogniseResponse>(url, request);
  }
}
