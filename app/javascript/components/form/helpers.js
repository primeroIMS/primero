/* eslint-disable import/prefer-default-export */
import { Map, List } from "immutable";

import {
  FORM_MODE_SHOW,
  FORM_MODE_NEW,
  FORM_MODE_EDIT,
  FORM_MODE_DIALOG
} from "./constants";

export const buildFormModeObject = formMode => {
  return List([
    FORM_MODE_SHOW,
    FORM_MODE_NEW,
    FORM_MODE_EDIT,
    FORM_MODE_DIALOG
  ]).reduce(
    (object, mode) =>
      object.set(
        `is${mode.charAt(0).toUpperCase() + mode.slice(1)}`,
        formMode === mode || false
      ),
    new Map({})
  );
};
