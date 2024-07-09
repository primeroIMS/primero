// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */

import { FETCH_TRANSITIONS } from "./actions";

export const fetchTransitions = (recordType, record) => async dispatch => {
  dispatch({
    type: FETCH_TRANSITIONS,
    api: {
      path: `${recordType}/${record}/transitions`
    }
  });
};
