/* eslint-disable import/prefer-default-export */

import { SET_LOCALE } from "./actions";

export const setLocale = payload => {
  return {
    type: SET_LOCALE,
    payload
  };
};
