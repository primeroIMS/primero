import { systemSettingsLogin } from "../../../config/endpoint-mocks";
import { LOGIN } from "./actions";

export const loginSystemSettings = () => async dispatch => {
  const payload = await systemSettingsLogin();
  console.log('systemSettingsLogin: ', systemSettingsLogin);
  dispatch({
    type: LOGIN,
    payload
  });
};