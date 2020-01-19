import {
  getIntentName,
  getRequestType,
  HandlerInput,
  RequestHandler
} from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';
import {
  getPersistentAttributes,
  savePausedPodcastEpisode
} from '../util/attributesUtil';
import { PersistentAttributes } from '../model/attributesModel';

export class CancelAndStopIntentHandler implements RequestHandler {
  canHandle(input: HandlerInput): Promise<boolean> | boolean {
    return (
      getRequestType(input.requestEnvelope) === 'IntentRequest' &&
      (getIntentName(input.requestEnvelope) === 'AMAZON.CancelIntent' ||
        getIntentName(input.requestEnvelope) === 'AMAZON.StopIntent' ||
        getIntentName(input.requestEnvelope) === 'AMAZON.PauseIntent')
    );
  }

  async handle(input: HandlerInput): Promise<Response> {
    const persistentAttributes = await getPersistentAttributes(input);

    await this.savePausedEpisode(input, persistentAttributes);

    return input.responseBuilder
      .addAudioPlayerClearQueueDirective('CLEAR_ALL')
      .addAudioPlayerStopDirective()
      .withShouldEndSession(true)
      .getResponse();
  }

  private async savePausedEpisode(
    input: HandlerInput,
    persistentAttributes: PersistentAttributes
  ) {
    const offset: number =
      input.requestEnvelope.context.AudioPlayer?.offsetInMilliseconds || 0;
    const episode: number =
      Number(input.requestEnvelope.context.AudioPlayer?.token) || 0;

    await savePausedPodcastEpisode(
      persistentAttributes,
      offset,
      episode,
      input
    );
  }
}
