import { LaunchRequestHandler } from './handlers/LaunchRequestHandler';
import { YesIntentHandler } from './handlers/YesIntentHandler';
import { NextIntentHandler } from './handlers/NextIntentHandler';
import { NoIntentHandler } from './handlers/NoIntentHandler';
import { HelpIntentHandler } from './handlers/HelpIntentHandler';
import { CancelAndStopIntentHandler } from './handlers/CancelAndStopIntentHandler';
import { SessionEndedRequestHandler } from './handlers/SessionEndedRequestHandler';
import { IntentReflectorHandler } from './handlers/IntentReflectorHandler';
import { CustomErrorHandler } from './handlers/CustomErrorHandler';
import { PodcastManager } from './PodcastManager';
import { LocalisationRequestInterceptor } from './interceptors/LocalisationRequestInterceptor';
import { FallbackIntentHandler } from './handlers/FallbackIntentHandler';
import { SkillBuilders } from 'ask-sdk';
import { LambdaHandler } from 'ask-sdk-core/dist/skill/factory/BaseSkillFactory';
import { PlayRandomPodcastHandler } from './handlers/PlayRandomPodcastHandler';
import { PlayLatestPodcastHandler } from './handlers/PlayLatestPodcastHandler';
import { PreviousIntentHandler } from './handlers/PreviousIntentHandler';
import { ResumeIntentHandler } from './handlers/ResumeIntentHandler';

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
function buildLambdaSkill(): LambdaHandler {
  const podcastManager = new PodcastManager();

  return SkillBuilders.standard()
    .addRequestHandlers(
      new LaunchRequestHandler(podcastManager),
      new HelpIntentHandler(),
      new SessionEndedRequestHandler(),
      new YesIntentHandler(podcastManager),
      new NoIntentHandler(),
      new PlayRandomPodcastHandler(podcastManager),
      new PlayLatestPodcastHandler(podcastManager),
      new ResumeIntentHandler(podcastManager),
      new NextIntentHandler(podcastManager),
      new PreviousIntentHandler(podcastManager),
      new CancelAndStopIntentHandler(),
      new FallbackIntentHandler(),
      new IntentReflectorHandler() // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(new CustomErrorHandler())
    .addRequestInterceptors(new LocalisationRequestInterceptor())
    .withCustomUserAgent('tech-weeklies-skill')
    .withTableName('dynamodb-techweeklies-alexaskill')
    .withAutoCreateTable(true)
    .lambda();
}

export let handler = buildLambdaSkill();
