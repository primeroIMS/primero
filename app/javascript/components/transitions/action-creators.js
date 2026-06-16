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
