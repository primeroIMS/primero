import * as Actions from "./actions";

export const fetchData = data => async dispatch => {
  dispatch({
    type: `${Actions.FETCH_DATA}`,
    api: {
      path: data.path
    }
  });
};
