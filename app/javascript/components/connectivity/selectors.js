// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

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

export const selectBrowserStatus = state => state.getIn([NAMESPACE, "online"], false);

export const selectServerStatusRetries = state => state.getIn([NAMESPACE, "serverStatusRetries"], 0);

export const selectQueueStatus = state => state.getIn([NAMESPACE, "queueStatus"], QUEUE_PENDING);

export const getQueueData = state => state.getIn([NAMESPACE, "queueData"], fromJS([]));

export const hasQueueData = state => !getQueueData(state).isEmpty();

export const selectUserToggleOffline = state => state.getIn([NAMESPACE, "fieldMode"], false);

export const selectPendingUserLogin = state => state.getIn([NAMESPACE, "pendingUserLogin"], false);
