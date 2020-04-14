import { RECORD_PATH } from "../../../../../config/constants";

import actions from "./actions";

// eslint-disable-next-line import/prefer-default-export
export const fetchForms = () => ({
  type: actions.RECORD_FORMS,
  api: {
    path: RECORD_PATH.forms,
    normalizeFunc: "normalizeFormData"
  }
});
