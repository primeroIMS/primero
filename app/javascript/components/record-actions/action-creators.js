import {
  SET_DIALOG,
  SET_DIALOG_PENDING
} from "./actions";

export const setDialog = payload => {
  return {
    type: SET_DIALOG,
    payload
  };
};

export const setPending = payload => {
  return {
    type: SET_DIALOG_PENDING,
    payload
  };
};


