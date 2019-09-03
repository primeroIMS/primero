import { ENQUEUE_SNACKBAR } from "components/notifier";
import * as Actions from "./actions";
import mockedData from "./mocked-data";
import { Option } from "./records";

export const setSelectedForm = payload => {
  return {
    type: Actions.SET_SELECTED_FORM,
    payload
  };
};

export const fetchForms = () => async dispatch => {
  dispatch({
    type: Actions.RECORD_FORMS,
    api: {
      path: "forms",
      normalizeFunc: "normalizeFormData"
    }
  });
};

export const fetchRecord = (namespace, id) => async dispatch => {
  dispatch({
    type: Actions.SELECTED_RECORD,
    api: {
      path: `${namespace}/${id}`
    }
  });
};

export const fetchOptions = () => async dispatch => {
  dispatch({
    type: Actions.SET_OPTIONS,
    payload: mockedData.data.map(option => Option(option))
  });
};

export const saveRecord = (
  namespace,
  saveMethod,
  body,
  id,
  message
) => async dispatch => {
  await dispatch({
    type: Actions.SAVE_RECORD,
    api: {
      path: saveMethod === "update" ? `${namespace}/${id}` : `${namespace}`,
      method: saveMethod === "update" ? "PATCH" : "POST",
      body,
      successCallback: {
        action: ENQUEUE_SNACKBAR,
        payload: {
          message,
          options: {
            variant: "success",
            key: new Date().getTime() + Math.random()
          }
        },
        redirect: `/${namespace}`
      }
    }
  });
};
