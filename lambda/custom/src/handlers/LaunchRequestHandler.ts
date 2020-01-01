import { getRequestType, HandlerInput, RequestHandler } from 'ask-sdk-core';
import { getPodcastMetadata } from '../util/podcastUtil';
import { PodcastManager } from '../PodcastManager';
import { Podcast } from '../model/podcastModel';

export class LaunchRequestHandler implements RequestHandler {
  private podcastManager: PodcastManager;

  constructor(podcastManager: PodcastManager) {
    this.podcastManager = podcastManager;
  }

  canHandle(input: HandlerInput): boolean {
    return getRequestType(input.requestEnvelope) === 'LaunchRequest';
  }

  async handle(input: HandlerInput) {
    const podcast: Podcast = await this.podcastManager.getCurrentPodcast()!;
    const speakOutput = 'playing podcast...';
    console.log('PODCAST DATA: ', podcast);

    return input.responseBuilder
      .speak(speakOutput)
      .addAudioPlayerPlayDirective(
        'REPLACE_ALL',
        podcast.enclosure.url,
        podcast.guid,
        0,
        undefined,
        getPodcastMetadata(podcast)
      )
      .withStandardCard(
        podcast.title,
        podcast.itunes.summary,
        podcast.itunes.image,
        podcast.itunes.image
      )
      .withShouldEndSession(true)
      .getResponse();
  }
}
