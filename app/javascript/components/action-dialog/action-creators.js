// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { SET_DIALOG, SET_DIALOG_PENDING, CLEAR_DIALOG } from "./actions";

export const setDialog = payload => ({
  type: SET_DIALOG,
  payload
});

export const clearDialog = () => ({
  type: CLEAR_DIALOG
});

export const setPending = payload => ({
  type: SET_DIALOG_PENDING,
  payload
});
