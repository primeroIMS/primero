import { useDispatch, useSelector } from "react-redux";

import { getUseIdentityProvider } from "../login/selectors";

import { refreshToken } from "./action-creators";

// eslint-disable-next-line import/prefer-default-export
export const useRefreshUserToken = () => {
  const dispatch = useDispatch();
  const isIDP = useSelector(state => getUseIdentityProvider(state));

  return {
    refreshUserToken: checkUserAuth => {
      if (!isIDP) dispatch(refreshToken(checkUserAuth));
    }
  };
};
