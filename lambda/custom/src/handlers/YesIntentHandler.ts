import {
  getIntentName,
  getRequestType,
  HandlerInput,
  RequestHandler
} from 'ask-sdk-core';

export class YesIntentHandler implements RequestHandler {
  canHandle(input: HandlerInput): Promise<boolean> | boolean {
    return (
      getRequestType(input.requestEnvelope) === 'IntentRequest' &&
      getIntentName(input.requestEnvelope) === 'AMAZON.YesIntent'
    );
  }

  handle(input: HandlerInput) {
    // const attributesManager = input.attributesManager;
    // const sessionAttributes = attributesManager.getSessionAttributes();

    /*if (sessionAttributes.isWaitingForWelcomeAnswer === true) {
      sessionAttributes.isWaitingForWelcomeAnswer = false;
      attributesManager.setSessionAttributes(sessionAttributes);

      const podcast = this.podcastManager.getCurrentPodcast()!;
      const speakOutput = 'playing podcast...';

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
    }*/

    const speakOutput = "sorry the podcast isn't available";

    return input.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
}
