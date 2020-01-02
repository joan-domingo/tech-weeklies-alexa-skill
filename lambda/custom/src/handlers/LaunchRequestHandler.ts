import { getRequestType, HandlerInput, RequestHandler } from 'ask-sdk-core';
import { PodcastManager } from '../PodcastManager';
import { Response } from 'ask-sdk-model';
import { getPodcastMetadata } from '../util/podcastUtil';

export class LaunchRequestHandler implements RequestHandler {
  private podcastManager: PodcastManager;

  constructor(podcastManager: PodcastManager) {
    this.podcastManager = podcastManager;
  }

  canHandle(input: HandlerInput): boolean {
    return getRequestType(input.requestEnvelope) === 'LaunchRequest';
  }

  handle(input: HandlerInput): Promise<Response> | Response {
    return new Promise((resolve: (value: Response) => void) => {
      this.podcastManager.fetchPodcasts(podcasts => {
        const podcast = podcasts![0];
        resolve(
          input.responseBuilder
            .speak(
              input.attributesManager.getRequestAttributes().t('WELCOME_MSG')
            )
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
            .getResponse()
        );
      });
    });
  }
}
