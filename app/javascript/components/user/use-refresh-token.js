import { useDispatch } from "react-redux";

import { useMemoizedSelector } from "../../libs";
import { refreshIdpToken } from "../login/components/idp-selection/auth-provider";
import { getUseIdentityProvider, getSelectedIDP } from "../login/selectors";

import { getIsAuthenticated } from "./selectors";
import { refreshToken } from "./action-creators";
import { SELECTED_IDP } from "./constants";

export default () => {
  const dispatch = useDispatch();
  const selectedIDP = localStorage.getItem(SELECTED_IDP);
  const isAuthenticated = useMemoizedSelector(state => getIsAuthenticated(state));
  const isIDP = useMemoizedSelector(state => getUseIdentityProvider(state));
  const idp = useMemoizedSelector(state => getSelectedIDP(state, selectedIDP));

  return {
    refreshUserToken: checkUserAuth => {
      if (!isAuthenticated) return;

      if (isIDP && idp) {
        refreshIdpToken(idp, () => {
          dispatch(refreshToken(checkUserAuth));
        });
      } else {
        dispatch(refreshToken(checkUserAuth));
      }
    }
  };
};
