import { systemSettingsLogin } from "../../../config/endpoint-mocks";
import { LOGIN } from "./actions";

export const loginSystemSettings = () => async dispatch => {
  const payload = await systemSettingsLogin();

  dispatch({
    type: LOGIN,
    payload
  });
};