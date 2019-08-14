import * as Actions from "./actions";

export const fetchData = () => async dispatch => {
  dispatch({
    type: Actions.FETCH_DATA,
    api: {
      path: "contact_information"
    }
  });
};
