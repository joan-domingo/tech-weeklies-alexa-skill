import {
  getIntentName,
  getRequestType,
  HandlerInput,
  RequestHandler
} from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';
import {
  getSessionAttributes,
  setSessionAttributes,
  t
} from '../util/attributesUtil';

export class NoIntentHandler implements RequestHandler {
  canHandle(input: HandlerInput): Promise<boolean> | boolean {
    const sessionAttributes = getSessionAttributes(input);
    return (
      getRequestType(input.requestEnvelope) === 'IntentRequest' &&
      getIntentName(input.requestEnvelope) === 'AMAZON.NoIntent' &&
      sessionAttributes.isWaitingForAnAnswer
    );
  }

  handle(input: HandlerInput): Promise<Response> | Response {
    const sessionAttributes = getSessionAttributes(input);

    sessionAttributes.isWaitingForAnAnswer = false;
    setSessionAttributes(input, sessionAttributes);

    const speakOutput = t(input, 'HELP_MSG');

    return input.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
}
