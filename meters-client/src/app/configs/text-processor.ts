import {environment} from '../../environments/environment';
import {Provider} from '@angular/core';

export const TEXT_PROCESSOR_TOKEN = 'TEXT_PROCESSOR_API';

const getTextProcessorApiUrl = () => environment.backendApi;

export const textProcessorApiProvider: Provider = {
  provide: TEXT_PROCESSOR_TOKEN,
  useValue: getTextProcessorApiUrl()
};
