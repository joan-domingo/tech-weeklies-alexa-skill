import { CustomSkillRequestHandler } from 'ask-sdk-core/dist/dispatcher/request/handler/CustomSkillRequestHandler';
import { getIntentName, getRequestType, HandlerInput } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';

/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet
 * */
export class FallbackIntentHandler implements CustomSkillRequestHandler {
  canHandle(input: HandlerInput): Promise<boolean> | boolean {
    return (
      getRequestType(input.requestEnvelope) === 'IntentRequest' &&
      getIntentName(input.requestEnvelope) === 'AMAZON.FallbackIntent'
    );
  }

  handle(input: HandlerInput): Promise<Response> | Response {
    const speakOutput = input.attributesManager
      .getRequestAttributes()
      .t('FALLBACK_MSG');

    return input.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
}
