import mockedData from "./mocked-data";
import { normalizeData } from "./schema";
import * as Actions from "./actions";

export const setSelectedForm = payload => {
  return {
    type: Actions.SET_SELECTED_FORM,
    payload
  };
};

export const fetchForms = () => async dispatch => {
  const data = normalizeData(mockedData.data);

  dispatch({
    type: Actions.SET_FORMS,
    payload: data.entities
  });
};
