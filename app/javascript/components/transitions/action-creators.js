import * as Actions from "./actions";

export const fetchTransitions = (recordType, record) => async dispatch => {
  dispatch({
    type: Actions.FETCH_TRANSITIONS,
    api: {
      path: `${recordType}/${record}/transitions`
    }
  });
};
