import {
  getIntentName,
  getRequestType,
  HandlerInput,
  RequestHandler
} from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';
import { t } from '../util/attributesUtil';

export class HelpIntentHandler implements RequestHandler {
  canHandle(input: HandlerInput): Promise<boolean> | boolean {
    return (
      getRequestType(input.requestEnvelope) === 'IntentRequest' &&
      getIntentName(input.requestEnvelope) === 'AMAZON.HelpIntent'
    );
  }

  handle(input: HandlerInput): Promise<Response> | Response {
    const speakOutputMsg = t(input, 'HELP_MSG');

    return input.responseBuilder
      .speak(speakOutputMsg)
      .reprompt(speakOutputMsg)
      .getResponse();
  }
}
