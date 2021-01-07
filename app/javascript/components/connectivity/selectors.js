/* eslint-disable import/prefer-default-export */
import { fromJS } from "immutable";

import { QUEUE_PENDING } from "../../libs/queue";

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

export const selectQueueStatus = state => state.getIn([NAMESPACE, "queueStatus"], QUEUE_PENDING);
