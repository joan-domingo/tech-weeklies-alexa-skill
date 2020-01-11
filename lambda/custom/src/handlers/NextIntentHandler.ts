import {
  getIntentName,
  getRequestType,
  HandlerInput,
  RequestHandler
} from 'ask-sdk-core';
import { PodcastManager } from '../PodcastManager';
import { getPodcastMetadata } from '../util/podcastUtil';
import { Response } from 'ask-sdk-model';

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

  handle(input: HandlerInput): Promise<Response> | Response {
    const speakOutput = 'playing next podcast...';
    const podcast = this.podcastManager.getNextPodcast()!;

    return input.responseBuilder
      .speak(speakOutput)
      .addAudioPlayerPlayDirective(
        'REPLACE_ALL',
        podcast.enclosure.url,
        podcast.itunes.episode.toString(),
        0,
        undefined,
        getPodcastMetadata(podcast)
      )
      .withShouldEndSession(true)
      .getResponse();
  }
}
