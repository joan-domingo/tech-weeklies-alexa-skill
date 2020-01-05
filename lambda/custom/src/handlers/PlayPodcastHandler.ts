import {
  getIntentName,
  getRequestType,
  HandlerInput,
  RequestHandler
} from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';

export class PlayPodcastHandler implements RequestHandler {
  canHandle(input: HandlerInput): Promise<boolean> | boolean {
    return (
      getRequestType(input.requestEnvelope) === 'IntentRequest' &&
      getIntentName(input.requestEnvelope) === 'PlayPodcastIntent'
    );
  }

  handle(input: HandlerInput): Promise<Response> | Response {
    return input.responseBuilder
      .speak('PlayPodcastIntent invoked')
      .getResponse();
  }
}
