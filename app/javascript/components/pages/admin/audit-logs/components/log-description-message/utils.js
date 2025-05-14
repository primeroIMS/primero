// Copyright (c) 2014 UNICEF. All rights reserved.

import { ACTIONS_WITH_RECORD_ID } from "./constants";

/* eslint-disable import/prefer-default-export */
export const getRecordValue = (dataRecord, key) => {
  const attribute = dataRecord.get(key) || "";
  const action = dataRecord.get("action");

  return attribute && ACTIONS_WITH_RECORD_ID.includes(action) ? attribute : "";
};
