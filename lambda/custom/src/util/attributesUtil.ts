import { HandlerInput } from 'ask-sdk-core';
import {
  PersistentAttributes,
  SessionAttributes
} from '../model/attributesModel';

/** REQUEST UTILS */

export function t(handlerInput: HandlerInput, key: string, args?: any) {
  return handlerInput.attributesManager.getRequestAttributes().t(key, args);
}

/** SESSION UTILS */

export function getSessionAttributes(handlerInput: HandlerInput) {
  return handlerInput.attributesManager.getSessionAttributes<
    SessionAttributes
  >();
}

export function setSessionAttributes(
  handlerInput: HandlerInput,
  sessionAttributes: SessionAttributes
) {
  handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
}

/** PERSISTENT UTILS */

export async function getPersistentAttributes(
  handlerInput: HandlerInput
): Promise<PersistentAttributes> {
  return (await handlerInput.attributesManager.getPersistentAttributes()) as PersistentAttributes;
}

export async function setAndSavePersistentAttributes(
  handlerInput: HandlerInput,
  persistentAttributes: PersistentAttributes
) {
  handlerInput.attributesManager.setPersistentAttributes(persistentAttributes);
  await handlerInput.attributesManager.savePersistentAttributes();
}

export function isUserOnboarded(attrs: PersistentAttributes): boolean {
  return attrs.profile ? attrs.profile.isFirstTimeOnboarded : false;
}

export function getListenedPodcastsTokens(
  attrs: PersistentAttributes
): number[] {
  return attrs.activity && attrs.activity.playedPodcastEpisodes
    ? attrs.activity.playedPodcastEpisodes
    : [];
}

export async function saveListenedPodcastEpisode(
  episode: number,
  attrs: PersistentAttributes,
  handlerInput: HandlerInput
): Promise<void> {
  const newValue = attrs.activity?.playedPodcastEpisodes || [];
  newValue.push(episode);

  attrs.activity = {
    ...attrs.activity,
    playedPodcastEpisodes: newValue
  };

  await setAndSavePersistentAttributes(handlerInput, attrs);
}

export async function savePausedPodcastEpisode(
  attrs: PersistentAttributes,
  offset: number,
  episode: number,
  handlerInput: HandlerInput
) {
  attrs.activity = {
    ...attrs.activity,
    pausedPodcast: {
      offset,
      episode
    }
  };

  await setAndSavePersistentAttributes(handlerInput, attrs);
}

export function hasPausedPodcast(attrs: PersistentAttributes): boolean {
  const pausedPodcast = attrs.activity?.pausedPodcast || null;
  return (
    pausedPodcast !== null &&
    pausedPodcast.episode !== 0 &&
    pausedPodcast.offset !== 0
  );
}

export function getPausedPodastEpisode(
  attrs: PersistentAttributes
): { episode: number; offset: number } {
  const episode = attrs.activity!.pausedPodcast!.episode;
  const offset = attrs.activity!.pausedPodcast!.offset;
  return { episode, offset };
}

export async function deletePausedPodcastEpisode(
  attrs: PersistentAttributes,
  handlerInput: HandlerInput
) {
  attrs.activity!.pausedPodcast = {
    episode: 0,
    offset: 0
  };
  await setAndSavePersistentAttributes(handlerInput, attrs);
}
