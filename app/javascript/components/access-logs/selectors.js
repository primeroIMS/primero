// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */
import { fromJS } from "immutable";

import NAMESPACE from "./namespace";

export const getAccessLogs = (state, id, recordType) =>
  state
    .getIn(["records", NAMESPACE, "data"], fromJS([]))
    .filter(log => log.record_type === recordType && log.record_id === id);

export const getAccessLogLoading = state => state.getIn(["records", NAMESPACE, "loading"], false);
export const getAccessLogMetadata = state => state.getIn(["records", NAMESPACE, "metadata"], fromJS({}));
