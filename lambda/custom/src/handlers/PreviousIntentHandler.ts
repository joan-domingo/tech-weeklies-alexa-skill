import {
  getIntentName,
  getRequestType,
  HandlerInput,
  RequestHandler
} from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';
import { PodcastManager } from '../PodcastManager';
import {
  getListenedPodcastsTokens,
  getPersistentAttributes
} from '../util/attributesUtil';

export class PreviousIntentHandler implements RequestHandler {
  private podcastManager: PodcastManager;

  constructor(podcastManager: PodcastManager) {
    this.podcastManager = podcastManager;
  }

  canHandle(input: HandlerInput): Promise<boolean> | boolean {
    return (
      getRequestType(input.requestEnvelope) === 'IntentRequest' &&
      getIntentName(input.requestEnvelope) === 'AMAZON.PreviousIntent'
    );
  }

  async handle(input: HandlerInput): Promise<Response> {
    const persistentAttributes = await getPersistentAttributes(input);
    const listenedEpisodes = getListenedPodcastsTokens(persistentAttributes);
    const currentEpisode = [...listenedEpisodes].pop()!;

    return this.podcastManager.playPreviousPodcast(
      input,
      persistentAttributes,
      currentEpisode
    );
  }
}
