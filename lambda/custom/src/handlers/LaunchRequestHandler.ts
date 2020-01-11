import { getRequestType, HandlerInput, RequestHandler } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';
import {
  getPersistentAttributes,
  getSessionAttributes,
  isUserOnboarded,
  setAndSavePersistentAttributes,
  setSessionAttributes,
  t
} from '../util/attributesUtil';
import { PersistentAttributes } from '../model/attributesModel';

export class LaunchRequestHandler implements RequestHandler {
  canHandle(input: HandlerInput): boolean {
    return getRequestType(input.requestEnvelope) === 'LaunchRequest';
  }

  async handle(input: HandlerInput): Promise<Response> {
    const persistentAttributes = await getPersistentAttributes(input);
    const isOnboarded = isUserOnboarded(persistentAttributes);

    const outputMsg = this.determineOutputMsg(isOnboarded, input);
    const outputQuestion = this.determineOutputQuestion(isOnboarded, input);
    const repromptOutputMsg = t(input, 'HELP_MSG');

    if (!isOnboarded) {
      this.setUserAsOnboarded(input, persistentAttributes);
    }

    return input.responseBuilder
      .speak(`${outputMsg} ${outputQuestion}`)
      .reprompt(repromptOutputMsg)
      .getResponse();
  }

  private determineOutputMsg(
    isOnboarded: boolean,
    input: HandlerInput
  ): string {
    return isOnboarded
      ? t(input, 'WELCOME_MSG')
      : t(input, 'ONBOARDING_WELCOME_MSG');
  }

  private determineOutputQuestion(isOnboarded: boolean, input: HandlerInput) {
    const outputQuestionKey = this.determineOutputQuestionKey();
    const sessionAttributes = getSessionAttributes(input);

    sessionAttributes.isWaitingForAnAnswer = true;
    sessionAttributes.askedQuestionKey = outputQuestionKey;
    setSessionAttributes(input, sessionAttributes);

    return isOnboarded ? t(input, outputQuestionKey) : t(input, 'HELP_MSG');
  }

  private determineOutputQuestionKey() {
    return 'PLAY_RANDOM_PODCAST_QUESTION';
  }

  private async setUserAsOnboarded(
    input: HandlerInput,
    persistentAttributes: PersistentAttributes
  ) {
    persistentAttributes.profile = {
      isFirstTimeOnboarded: true
    };
    await setAndSavePersistentAttributes(input, persistentAttributes);
  }
}
