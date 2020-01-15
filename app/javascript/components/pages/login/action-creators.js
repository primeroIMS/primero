import { DB } from "../../../config";

import { LOGIN } from "./actions";

export const loginSystemSettings = () => async dispatch => {
  return dispatch({
    type: LOGIN,
    api: {
      path: "identity_providers",
      method: "GET"
    }
  });
};