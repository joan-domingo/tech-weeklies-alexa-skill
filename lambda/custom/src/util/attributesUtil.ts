import { HandlerInput } from 'ask-sdk-core';
import { SessionAttributes } from '../model/attributesModel';

export async function getSessionAttributes(handlerInput: HandlerInput) {
  return handlerInput.attributesManager.getSessionAttributes<
    SessionAttributes
  >();
}

export function getPersistentAttributes(
  handlerInput: HandlerInput
): Promise<{ [key: string]: any }> {
  return handlerInput.attributesManager.getPersistentAttributes();
}

export function setPersistentAttributes(
  handlerInput: HandlerInput,
  persistentAttributes: any
) {
  handlerInput.attributesManager.setPersistentAttributes(persistentAttributes);
}
