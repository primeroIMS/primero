/* eslint-disable camelcase */
import isEmpty from "lodash/isEmpty";

import findOptionLabel from "./find-option-label";

export default (keys, field, locale) => {
  const { option_labels: optionLabels } = field;

  if (!isEmpty(optionLabels)) {
    const translations = optionLabels[locale].map(({ id, display_text: displayText }) => {
      const fallbackDisplayText = isEmpty(displayText) ? findOptionLabel(optionLabels, id)?.display_text : displayText;

      return {
        id,
        display_text: fallbackDisplayText
      };
    });

    return translations.filter(translation => keys.includes(translation.id));
  }

  return [];
};
