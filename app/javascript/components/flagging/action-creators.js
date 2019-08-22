import mockedData from "./mockData";
import * as Actions from "./actions";

export const fetchFlags = () => async dispatch => {
  dispatch({
    type: Actions.FETCH_FLAGS_SUCCESS,
    payload: mockedData.data
  });
};
