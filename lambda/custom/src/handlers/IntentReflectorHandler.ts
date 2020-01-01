import {
  getIntentName,
  getRequestType,
  HandlerInput,
  RequestHandler
} from 'ask-sdk-core';

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said.
export class IntentReflectorHandler implements RequestHandler {
  canHandle(input: HandlerInput): Promise<boolean> | boolean {
    return getRequestType(input.requestEnvelope) === 'IntentRequest';
  }

  handle(input: HandlerInput) {
    const intentName = getIntentName(input.requestEnvelope);
    const speakOutput = `You just triggered ${intentName}`;

    return (
      input.responseBuilder
        .speak(speakOutput)
        //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
        .getResponse()
    );
  }
}
