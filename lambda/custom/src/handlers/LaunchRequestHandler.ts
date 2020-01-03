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

  async handle(input: HandlerInput): Promise<Response> {
    let speakOutputKey = 'WELCOME_MSG';

    const persistentAttributes = await input.attributesManager.getPersistentAttributes();

    console.log(persistentAttributes);
    if (
      persistentAttributes.profile &&
      persistentAttributes.profile.isFirstTimeOnboarded
    ) {
      speakOutputKey = 'Welcome again';
    } else {
      console.log('2');
      persistentAttributes.profile = {
        isFirstTimeOnboarded: true
      };
    }
    console.log(persistentAttributes);

    input.attributesManager.setPersistentAttributes(persistentAttributes);
    await input.attributesManager.savePersistentAttributes();

    return this.podcastManager.playCurrentPodcast(input, speakOutputKey);
  }
}
