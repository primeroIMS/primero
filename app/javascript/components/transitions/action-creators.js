import * as actions from "./actions";

export const fetchTransitions = (recordType, record) => async dispatch => {
  dispatch({
    type: actions.FETCH_TRANSITIONS,
    api: {
      path: `${recordType}/${record}/transitions`
    }
  });
};
