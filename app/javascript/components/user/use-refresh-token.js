// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import useMemoizedSelector from "../../libs/use-memoized-selector";
import { refreshIdpToken } from "../login/components/idp-selection/auth-provider";
import { getUseIdentityProvider, getSelectedIDP } from "../login/selectors";

import { getIsAuthenticated } from "./selectors";
import { refreshToken } from "./action-creators";
import { SELECTED_IDP } from "./constants";

export default () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const selectedIDP = JSON.parse(window.sessionStorage.getItem(SELECTED_IDP));
  const isAuthenticated = useMemoizedSelector(state => getIsAuthenticated(state));
  const isIDP = useMemoizedSelector(state => getUseIdentityProvider(state));
  const idp = useMemoizedSelector(state => getSelectedIDP(state, selectedIDP?.unique_id));

  return {
    refreshUserToken: checkUserAuth => {
      if (!isAuthenticated) return;
      if (isIDP && idp) {
        refreshIdpToken(
          idp,
          () => {
            dispatch(refreshToken(checkUserAuth));
          },
          history
        );
      } else {
        dispatch(refreshToken(checkUserAuth));
      }
    }
  };
};
