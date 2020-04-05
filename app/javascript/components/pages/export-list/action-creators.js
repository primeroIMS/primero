/* eslint-disable import/prefer-default-export */

import actions from "./actions";
import { EXPORT_URL } from "./constants";

export const fetchExports = data => {
  const { options } = data || {};

  return {
    type: actions.FETCH_EXPORTS,
    api: {
      path: EXPORT_URL,
      params: options
    }
  };
};
