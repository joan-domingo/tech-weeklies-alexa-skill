import {
  getIntentName,
  getRequestType,
  HandlerInput,
  RequestHandler
} from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';
import { getSessionAttributes, t } from '../util/attributesUtil';
import { PodcastManager } from '../PodcastManager';

export class YesIntentHandler implements RequestHandler {
  private podcastManager: PodcastManager;

  constructor(podcastManager: PodcastManager) {
    this.podcastManager = podcastManager;
  }

  canHandle(input: HandlerInput): Promise<boolean> | boolean {
    const sessionAttributes = getSessionAttributes(input);
    return (
      getRequestType(input.requestEnvelope) === 'IntentRequest' &&
      getIntentName(input.requestEnvelope) === 'AMAZON.YesIntent' &&
      sessionAttributes.isWaitingForAnAnswer
    );
  }

  handle(input: HandlerInput): Promise<Response> | Response {
    const sessionAttributes = getSessionAttributes(input);

    switch (sessionAttributes.askedQuestionKey) {
      case 'PLAY_RANDOM_PODCAST_QUESTION':
        return this.podcastManager.playRandomPodcast(input);
      case 'PLAY_LATEST_PODCAST_QUESTION':
        return this.podcastManager.playLatestPodcast(input);
      case 'RESUME_PODCAST_QUESTION':
      default:
        return input.responseBuilder
          .speak(t(input, 'FORGOT_QUESTION'))
          .getResponse();
    }
  }
}
