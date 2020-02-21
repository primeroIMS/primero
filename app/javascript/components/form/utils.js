import capitalize from "lodash/capitalize";
import { List, Map } from "immutable";

import {
  FORM_MODE_SHOW,
  FORM_MODE_NEW,
  FORM_MODE_EDIT,
  FORM_MODE_DIALOG
} from "./constants";

export const optionText = (option, i18n) => {
  const { display_text: displayText, display_name: displayName } = option;

  return displayText instanceof Object || displayName instanceof Object
    ? displayText?.[i18n.locale] || displayName?.[i18n.locale]
    : displayText || displayName;
};

export const whichOptions = ({
  optionStringsSource,
  options,
  i18n,
  lookups
}) => {
  if (optionStringsSource) {
    return lookups.map(lookup => {
      const displayText = optionText(lookup, i18n);
      const display = lookup.display_text
        ? { display_text: displayText }
        : { display_name: displayText };

      return { ...lookup, ...display };
    });
  }

  return Array.isArray(options) ? options : options?.[i18n.locale];
};

export const whichFormMode = currentMode => {
  return List([
    FORM_MODE_SHOW,
    FORM_MODE_NEW,
    FORM_MODE_EDIT,
    FORM_MODE_DIALOG
  ]).reduce(
    (object, mode) =>
      object.set(`is${capitalize(mode)}`, currentMode === mode || false),
    new Map({})
  );
};

export const touchedFormData = (
  touched,
  data,
  hasInitialValues = false,
  initialValues
) => {
  return Object.keys(touched).reduce((prev, current) => {
    const obj = prev;

    if (Array.isArray(touched[current])) {
      obj[current] = [];
      touched[current].forEach((value, key) => {
        obj[current][key] = touchedFormData(
          value,
          data[current][key],
          hasInitialValues,
          initialValues?.[current]?.[key]
        );
      });
    } else if (
      (hasInitialValues && initialValues?.[current] !== data[current]) ||
      !hasInitialValues
    ) {
      obj[current] = data[current];
    }

    return obj;
  }, {});
};
