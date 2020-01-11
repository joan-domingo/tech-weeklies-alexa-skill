import {
  getIntentName,
  getRequestType,
  HandlerInput,
  RequestHandler
} from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';
import { PodcastManager } from '../PodcastManager';
import { getPersistentAttributes } from '../util/attributesUtil';

export class PlayRandomPodcastHandler implements RequestHandler {
  private podcastManager: PodcastManager;

  constructor(podcastManager: PodcastManager) {
    this.podcastManager = podcastManager;
  }

  canHandle(input: HandlerInput): Promise<boolean> | boolean {
    return (
      getRequestType(input.requestEnvelope) === 'IntentRequest' &&
      getIntentName(input.requestEnvelope) === 'PlayRandomPodcastIntent'
    );
  }

  async handle(input: HandlerInput): Promise<Response> {
    const persistentAttributes = await getPersistentAttributes(input);

    return this.podcastManager.playRandomPodcast(input, persistentAttributes);
  }
}
