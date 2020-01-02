import { ErrorHandler, HandlerInput } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';

/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below
 * */
export class CustomErrorHandler implements ErrorHandler {
  canHandle(input: HandlerInput): Promise<boolean> | boolean {
    return true;
  }

  handle(input: HandlerInput, error: Error): Promise<Response> | Response {
    const speakOutput = input.attributesManager
      .getRequestAttributes()
      .t('ERROR_MSG');
    console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

    return input.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
}
