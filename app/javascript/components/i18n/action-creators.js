import * as Actions from "./actions";

export const setLocale = payload => {
  return {
    type: Actions.SET_LOCALE,
    payload
  };
};

export const fetchLocales = () => async dispatch => {
  dispatch({
    type: Actions.FETCH_LOCALES,
    api: {
      path: "system_settings"
    }
  });
};
