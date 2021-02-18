import { useDispatch } from "react-redux";

import { useMemoizedSelector } from "../../libs";
import { getUseIdentityProvider } from "../login/selectors";

import { refreshToken } from "./action-creators";

// eslint-disable-next-line import/prefer-default-export
export const useRefreshUserToken = () => {
  const dispatch = useDispatch();

  const isIDP = useMemoizedSelector(state => getUseIdentityProvider(state));

  return {
    refreshUserToken: checkUserAuth => {
      if (!isIDP) dispatch(refreshToken(checkUserAuth));
    }
  };
};
