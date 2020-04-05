import { SET_DIALOG, SET_DIALOG_PENDING } from "./actions";

export const setDialog = payload => ({
  type: SET_DIALOG,
  payload
});

export const setPending = payload => ({
  type: SET_DIALOG_PENDING,
  payload
});
