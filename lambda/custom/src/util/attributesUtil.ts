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
  return attrs.profile && attrs.profile.isFirstTimeOnboarded;
}
