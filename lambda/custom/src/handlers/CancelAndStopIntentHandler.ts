import {
  getIntentName,
  getRequestType,
  HandlerInput,
  RequestHandler
} from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';

export class CancelAndStopIntentHandler implements RequestHandler {
  canHandle(input: HandlerInput): Promise<boolean> | boolean {
    return (
      getRequestType(input.requestEnvelope) === 'IntentRequest' &&
      (getIntentName(input.requestEnvelope) === 'AMAZON.CancelIntent' ||
        getIntentName(input.requestEnvelope) === 'AMAZON.StopIntent' ||
        getIntentName(input.requestEnvelope) === 'AMAZON.PauseIntent')
    );
  }

  handle(input: HandlerInput): Promise<Response> | Response {
    const speakOutput = 'See you later, alligator!';

    return input.responseBuilder
      .speak(speakOutput)
      .addAudioPlayerClearQueueDirective('CLEAR_ALL')
      .addAudioPlayerStopDirective()
      .withShouldEndSession(true)
      .getResponse();
  }
}
