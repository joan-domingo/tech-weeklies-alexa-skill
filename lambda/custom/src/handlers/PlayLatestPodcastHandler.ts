import {
  getIntentName,
  getRequestType,
  HandlerInput,
  RequestHandler
} from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';
import { PodcastManager } from '../PodcastManager';

export class PlayLatestPodcastHandler implements RequestHandler {
  private podcastManager: PodcastManager;

  constructor(podcastManager: PodcastManager) {
    this.podcastManager = podcastManager;
  }

  canHandle(input: HandlerInput): Promise<boolean> | boolean {
    return (
      getRequestType(input.requestEnvelope) === 'IntentRequest' &&
      getIntentName(input.requestEnvelope) === 'PlayLatestPodcastIntent'
    );
  }

  handle(input: HandlerInput): Promise<Response> | Response {
    return this.podcastManager.playCurrentPodcast(
      input,
      'playing latest podcast...'
    );
  }
}
