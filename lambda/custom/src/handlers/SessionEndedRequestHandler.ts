import { getRequestType, HandlerInput, RequestHandler } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';

/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs
 * */
export class SessionEndedRequestHandler implements RequestHandler {
  canHandle(input: HandlerInput): Promise<boolean> | boolean {
    return getRequestType(input.requestEnvelope) === 'SessionEndedRequest';
  }

  handle(input: HandlerInput): Promise<Response> | Response {
    console.log(`~~~~ Session ended: ${JSON.stringify(input.requestEnvelope)}`);
    // Any cleanup logic goes here.
    return input.responseBuilder.getResponse(); // notice we send an empty response
  }
}
