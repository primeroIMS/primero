// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */
import { fromJS } from "immutable";

import NAMESPACE from "./namespace";

export const getChangeLogs = (state, id, recordType) => {
  const changeLogs = state
    .getIn(["records", NAMESPACE, "data"], fromJS([]))
    .filter(log => log.record_type === recordType && log.record_id === id);

  return changeLogs.size ? changeLogs : fromJS([]);
};

export const getChangeLogLoading = state => state.getIn(["records", NAMESPACE, "loading"], false);
export const getChangeLogMetadata = state => state.getIn(["records", NAMESPACE, "metadata"], fromJS({}));
