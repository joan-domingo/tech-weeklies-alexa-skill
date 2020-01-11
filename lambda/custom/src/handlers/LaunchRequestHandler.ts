import { getRequestType, HandlerInput, RequestHandler } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';
import {
  getListenedPodcastsTokens,
  getPersistentAttributes,
  getSessionAttributes,
  isUserOnboarded,
  setAndSavePersistentAttributes,
  setSessionAttributes,
  t
} from '../util/attributesUtil';
import { PersistentAttributes } from '../model/attributesModel';
import { PodcastManager } from '../PodcastManager';

export class LaunchRequestHandler implements RequestHandler {
  private podcastManager: PodcastManager;

  constructor(podcastManager: PodcastManager) {
    this.podcastManager = podcastManager;
  }

  canHandle(input: HandlerInput): boolean {
    return getRequestType(input.requestEnvelope) === 'LaunchRequest';
  }

  async handle(input: HandlerInput): Promise<Response> {
    console.log('hello');
    await this.podcastManager.fetchPodcasts();
    console.log('hello2', this.podcastManager);
    if (!this.podcastManager.hasFetchedPodcastsSuccessfully()) {
      return input.responseBuilder.speak(t(input, 'ERROR_MSG')).getResponse();
    }

    const persistentAttributes = await getPersistentAttributes(input);
    const isOnboarded = isUserOnboarded(persistentAttributes);

    const outputMsg = this.determineOutputMsg(isOnboarded, input);
    const outputQuestion = this.determineOutputQuestion(
      isOnboarded,
      input,
      persistentAttributes
    );
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

  private determineOutputQuestion(
    isOnboarded: boolean,
    input: HandlerInput,
    persistentAttributes: PersistentAttributes
  ) {
    const outputQuestionKey = this.determineOutputQuestionKey(
      persistentAttributes
    );
    const sessionAttributes = getSessionAttributes(input);

    sessionAttributes.isWaitingForAnAnswer = true;
    sessionAttributes.askedQuestionKey = outputQuestionKey;
    setSessionAttributes(input, sessionAttributes);

    return isOnboarded ? t(input, outputQuestionKey) : t(input, 'HELP_MSG');
  }

  private determineOutputQuestionKey(
    persistentAttributes: PersistentAttributes
  ) {
    const listenedPodcastsTokens = getListenedPodcastsTokens(
      persistentAttributes
    );
    if (
      !this.podcastManager.hasUserListenedToLatestPodcast(
        listenedPodcastsTokens
      )
    ) {
      return 'PLAY_LATEST_PODCAST_QUESTION';
    }
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
