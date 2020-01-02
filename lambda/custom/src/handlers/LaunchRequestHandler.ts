import { getRequestType, HandlerInput, RequestHandler } from 'ask-sdk-core';
import { PodcastManager } from '../PodcastManager';
import { Response } from 'ask-sdk-model';

export class LaunchRequestHandler implements RequestHandler {
  private podcastManager: PodcastManager;

  constructor(podcastManager: PodcastManager) {
    this.podcastManager = podcastManager;
  }

  canHandle(input: HandlerInput): boolean {
    return getRequestType(input.requestEnvelope) === 'LaunchRequest';
  }

  handle(input: HandlerInput): Promise<Response> | Response {
    const speakOutputKey = 'WELCOME_MSG';

    return new Promise(
      (resolve: (value: Promise<Response> | Response) => void) => {
        resolve(this.podcastManager.playCurrentPodcast(input, speakOutputKey));
      }
    );
  }
}
