import {
  getIntentName,
  getRequestType,
  HandlerInput,
  RequestHandler
} from 'ask-sdk-core';
import { PodcastManager } from '../PodcastManager';
import { Response } from 'ask-sdk-model';
import {
  getListenedPodcastsTokens,
  getPersistentAttributes
} from '../util/attributesUtil';

export class NextIntentHandler implements RequestHandler {
  private podcastManager: PodcastManager;

  constructor(podcastManager: PodcastManager) {
    this.podcastManager = podcastManager;
  }

  canHandle(input: HandlerInput): Promise<boolean> | boolean {
    return (
      getRequestType(input.requestEnvelope) === 'IntentRequest' &&
      getIntentName(input.requestEnvelope) === 'AMAZON.NextIntent'
    );
  }

  async handle(input: HandlerInput): Promise<Response> {
    const persistentAttributes = await getPersistentAttributes(input);
    const listenedEpisodes = getListenedPodcastsTokens(persistentAttributes);
    const currentEpisode = [...listenedEpisodes].pop()!;

    return this.podcastManager.playNextPodcast(
      input,
      persistentAttributes,
      currentEpisode
    );
  }
}
