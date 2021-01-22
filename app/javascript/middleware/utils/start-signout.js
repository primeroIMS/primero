import { signOut } from "../../components/login/components/idp-selection";
import { attemptSignout } from "../../components/user";

export default store => {
  const usingIdp = store.getState().getIn(["idp", "use_identity_provider"], false);
  const pendingUserLogin = store.getState().getIn(["connectivity", "pendingUserLogin"], false);

  if (pendingUserLogin) return;

  if (usingIdp) {
    signOut();
  }

  store.dispatch(attemptSignout());
};
