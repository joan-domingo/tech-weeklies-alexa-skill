import { CustomSkillRequestInterceptor } from 'ask-sdk-core/dist/dispatcher/request/interceptor/CustomSkillRequestInterceptor';
import { getLocale, HandlerInput } from 'ask-sdk-core';
import i18n from 'i18next';
import { languageStrings } from '../languageStrings';

type TranslationFunction = (...args: any[]) => string;

// This request interceptor will bind a translation function 't' to the handlerInput request attributes
export class LocalisationRequestInterceptor
  implements CustomSkillRequestInterceptor {
  process(input: HandlerInput): Promise<void> | void {
    i18n
      .init({
        lng: getLocale(input.requestEnvelope),
        resources: languageStrings
      })
      .then(t => {
        const attributes = input.attributesManager.getRequestAttributes();
        attributes.t = (...args: any[]) => (t as TranslationFunction)(...args);
      });
  }
}
