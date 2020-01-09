import capitalize from "lodash/capitalize";
import { List, Map } from "immutable";
import isEmpty from "lodash/isEmpty";
import isObject from "lodash/isObject";

import {
  FORM_MODE_SHOW,
  FORM_MODE_NEW,
  FORM_MODE_EDIT,
  FORM_MODE_DIALOG
} from "./constants";

export const registerInput = ({
  register,
  name,
  ref,
  defaultValue,
  setInputValue,
  clearSecondaryInput,
  dataSetter
}) => {
  return register(
    Object.defineProperty(
      {
        name
      },
      "value",
      {
        set(data) {
          setInputValue(data || defaultValue);
          
          ref.current = dataSetter ? dataSetter(data) : data;

          if (!data && clearSecondaryInput) {
            clearSecondaryInput();
          }
        },
        get() {
          return ref.current;
        }
      }
    )
  );
};

export const whichOptions = ({
  optionStringsSource,
  options,
  i18n,
  lookups
}) => {
  if (optionStringsSource) {
    return lookups;
  }

  return Array.isArray(options) ? options : options?.[i18n.locale];
};

export const optionText = (option, i18n) => {
  const { display_text: displayText, display_name: displayName } = option;

  return displayText instanceof Object || displayName instanceof Object
    ? displayText?.[i18n.locale] || displayName?.[i18n.locale]
    : displayText || displayName;
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

export const compactData = values =>
  Object.keys(values).reduce((prev, current) => {
    const obj = prev;
    const value = values[current];

    if ((Array.isArray(value) || isObject(value)) && isEmpty(value)) {
      return obj;
    }

    if (value) {
      obj[current] = values[current];
    }

    return obj;
  }, {});
