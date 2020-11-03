/* eslint-disable import/prefer-default-export */
import { fromJS } from "immutable";

import { NAMESPACE } from "./constants";

export const selectNetworkStatus = state => {
  const status = state.get(
    NAMESPACE,
    fromJS({
      online: false,
      serverOnline: false
    })
  );

  return status.get("online") && status.get("serverOnline");
};
