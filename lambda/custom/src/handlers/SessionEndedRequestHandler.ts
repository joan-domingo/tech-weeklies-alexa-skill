import { getRequestType, HandlerInput, RequestHandler } from 'ask-sdk-core';

export class SessionEndedRequestHandler implements RequestHandler {
  canHandle(input: HandlerInput): Promise<boolean> | boolean {
    return getRequestType(input.requestEnvelope) === 'SessionEndedRequest';
  }

  handle(input: HandlerInput) {
    // Any cleanup logic goes here.
    return input.responseBuilder.getResponse();
  }
}
