import { clearDialog } from "../../components/action-dialog";
import { setPendingUserLogin } from "../../components/connectivity/action-creators";
import DB from "../../db";
import { setAuthenticatedUser } from "../../components/user";

import handleReturnUrl from "./handle-return-url";

const getCookieValue = name => {
  const cookies = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);

  return cookies ? decodeURIComponent(cookies.pop()).replace(/\+/g, " ") : "";
};

export default async (store, user = {}, useIdentityProvider) => {
  const userObject = useIdentityProvider
    ? { user_name: getCookieValue("primero_user_name"), id: parseInt(getCookieValue("primero_user_id"), 10) }
    : user;
  const formatedUser = { username: userObject.user_name, id: userObject.id };

  const pendingUserLogin = store.getState().getIn(["connectivity", "pendingUserLogin"], false);
  const userFromDB = await DB.getRecord("user", formatedUser.username);

  if (!userFromDB) {
    await DB.clearDB();
  }

  localStorage.setItem("user", JSON.stringify(formatedUser));
  store.dispatch(setAuthenticatedUser(formatedUser));

  if (!pendingUserLogin) {
    handleReturnUrl(store);
  }

  store.dispatch(clearDialog());
  store.dispatch(setPendingUserLogin(false));
};
