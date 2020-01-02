import {
  getIntentName,
  getRequestType,
  HandlerInput,
  RequestHandler
} from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';

/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents
 * by defining them above, then also adding them to the request handler chain below
 * */
export class IntentReflectorHandler implements RequestHandler {
  canHandle(input: HandlerInput): Promise<boolean> | boolean {
    return getRequestType(input.requestEnvelope) === 'IntentRequest';
  }

  handle(input: HandlerInput): Promise<Response> | Response {
    const intentName = getIntentName(input.requestEnvelope);
    const speakOutput = input.attributesManager
      .getRequestAttributes()
      .t('REFLECTOR_MSG', { intentName: intentName });

    return (
      input.responseBuilder
        .speak(speakOutput)
        //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
        .getResponse()
    );
  }
}
