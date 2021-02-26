import { useDispatch } from "react-redux";

import { useMemoizedSelector } from "../../libs";
import { refreshIdpToken } from "../login/components/idp-selection/auth-provider";
import { getUseIdentityProvider, getSelectedIDP } from "../login/selectors";

import { refreshToken } from "./action-creators";
import { SELECTED_IDP } from "./constants";

// eslint-disable-next-line import/prefer-default-export
export const useRefreshUserToken = () => {
  const dispatch = useDispatch();
  const selectedIDP = localStorage.getItem(SELECTED_IDP);

  const isIDP = useMemoizedSelector(state => getUseIdentityProvider(state));
  const idp = useMemoizedSelector(state => getSelectedIDP(state, selectedIDP));

  return {
    refreshUserToken: checkUserAuth => {
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
