/* *
 * We create a language strings object containing all of our strings.
 * The keys for each string will then be referenced in our code, e.g. handlerInput.t('WELCOME_MSG').
 * The localisation interceptor in index.js will automatically choose the strings
 * that match the request's locale.
 * */

export const languageStrings = {
  en: {
    translation: {
      ONBOARDING_WELCOME_MSG: 'Welcome to Futurice Tech Weeklies.',
      WELCOME_MSG: 'Welcome back.',
      RESUME_PODCAST_QUESTION:
        'Would you like to resume the episode you were listening to?',
      PLAY_LATEST_PODCAST_QUESTION:
        'Would you like to listen to the latest episode?',
      PLAY_RANDOM_PODCAST_QUESTION:
        'Would you like to listen to a random episode?',
      PLAYING: 'Playing episode:',
      RESUMING: 'Resuming episode:',
      HELP_MSG:
        'Ask me to play the latest episode or a random one. What would you like to do?',
      REFLECTOR_MSG: 'You just triggered {{intentName}}',
      FALLBACK_MSG: "Sorry, I don't know about that. Please try again.",
      ERROR_MSG:
        'My bad, I had trouble doing what you asked. Please try again.',
      FORGOT_QUESTION: 'Sorry, I forgot what question I just asked you.'
    }
  }
};
