/* eslint-disable import/prefer-default-export */
import { TASK_TYPES } from "./constants";

const getLookupValue = (lookup, lookupAction) =>
  lookup.find(
    lookupValue => lookupValue.id === lookupAction
    // eslint-disable-next-line camelcase
  )?.display_text || "";

export const getTranslatedValue = (value, lookupAction, lookupServiceType, lookupFollowupType, i18nTranslation) => {
  if ([TASK_TYPES.SERVICE, TASK_TYPES.FOLLOW_UP].includes(value)) {
    const lookupTasksMapping = Object.freeze({
      [TASK_TYPES.FOLLOW_UP]: lookupFollowupType,
      [TASK_TYPES.SERVICE]: lookupServiceType
    });

    return i18nTranslation(`task.types.${value}`, {
      subtype: getLookupValue(lookupTasksMapping?.[value], lookupAction)
    });
  }

  return i18nTranslation(`task.types.${value}`);
};
