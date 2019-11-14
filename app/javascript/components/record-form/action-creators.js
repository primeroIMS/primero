import { DB } from "../../config";

import Actions from "./actions";
import mockedData from "./mocked-data";
import { Option } from "./records";

export const setSelectedForm = payload => {
  return {
    type: Actions.SET_SELECTED_FORM,
    payload
  };
};

export const setSelectedRecord = payload => {
  return {
    type: Actions.SET_SELECTED_RECORD,
    payload
  };
};

export const fetchForms = () => async dispatch => {
  dispatch({
    type: Actions.RECORD_FORMS,
    api: {
      path: "forms",
      normalizeFunc: "normalizeFormData",
      db: {
        collection: DB.FORMS
      }
    }
  });
};

export const fetchOptions = () => async dispatch => {
  dispatch({
    type: Actions.SET_OPTIONS,
    payload: mockedData.data.map(option => Option(option))
  });
};
