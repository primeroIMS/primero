import * as Actions from "./actions";

export const setLocale = payload => {
  return {
    type: Actions.SET_LOCALE,
    payload
  };
};
