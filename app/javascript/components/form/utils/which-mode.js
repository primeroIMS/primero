/* eslint-disable import/prefer-default-export */
import { List, Map } from "immutable";
import capitalize from "lodash/capitalize";

import {
  FORM_MODE_SHOW,
  FORM_MODE_NEW,
  FORM_MODE_EDIT,
  FORM_MODE_DIALOG
} from "../constants";

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
