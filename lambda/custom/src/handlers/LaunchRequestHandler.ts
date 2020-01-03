import { getRequestType, HandlerInput, RequestHandler } from 'ask-sdk-core';
import { PodcastManager } from '../PodcastManager';
import { Response } from 'ask-sdk-model';
import {
  getPersistentAttributes,
  isUserOnboarded,
  setAndSavePersistentAttributes
} from '../util/attributesUtil';

export class LaunchRequestHandler implements RequestHandler {
  private podcastManager: PodcastManager;

  constructor(podcastManager: PodcastManager) {
    this.podcastManager = podcastManager;
  }

  canHandle(input: HandlerInput): boolean {
    return getRequestType(input.requestEnvelope) === 'LaunchRequest';
  }

  async handle(input: HandlerInput): Promise<Response> {
    const persistentAttributes = await getPersistentAttributes(input);
    let speakOutputKey;

    if (isUserOnboarded(persistentAttributes)) {
      speakOutputKey = 'Welcome again';
    } else {
      speakOutputKey = 'WELCOME_MSG';
      persistentAttributes.profile = {
        isFirstTimeOnboarded: true
      };
    }

    await setAndSavePersistentAttributes(input, persistentAttributes);

    return this.podcastManager.playCurrentPodcast(input, speakOutputKey);
  }
}
