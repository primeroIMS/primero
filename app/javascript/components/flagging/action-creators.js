import * as Actions from "./actions";

export const fetchFlags = url => async dispatch => {
  dispatch({
    type: Actions.FETCH_FLAGS,
    api: {
      path: `${url.substr(1)}/flags`
    }
  });
};
