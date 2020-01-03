import { SkillBuilders } from 'ask-sdk-core';
import { DynamoDbPersistenceAdapter } from 'ask-sdk-dynamodb-persistence-adapter';
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
import { LambdaHandler } from 'ask-sdk-core/dist/skill/factory/BaseSkillFactory';
import { LocalisationRequestInterceptor } from './interceptors/LocalisationRequestInterceptor';
import { FallbackIntentHandler } from './handlers/FallbackIntentHandler';

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
function buildLambdaSkill(): LambdaHandler {
  const dynamoDbPersistenceAdapter = new DynamoDbPersistenceAdapter({
    tableName: 'dynamodb-techweeklies-alexaskill',
    createTable: true
  });
  const podcastManager = new PodcastManager();

  return SkillBuilders.custom()
    .addRequestHandlers(
      new LaunchRequestHandler(podcastManager),
      new NextIntentHandler(podcastManager),
      new YesIntentHandler(),
      new NoIntentHandler(),
      new HelpIntentHandler(),
      new CancelAndStopIntentHandler(),
      new FallbackIntentHandler(),
      new SessionEndedRequestHandler(),
      new IntentReflectorHandler() // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(new CustomErrorHandler())
    .addRequestInterceptors(new LocalisationRequestInterceptor())
    .withCustomUserAgent('tech-weeklies-skill')
    .withPersistenceAdapter(dynamoDbPersistenceAdapter)
    .lambda();
}

export let handler = buildLambdaSkill();
