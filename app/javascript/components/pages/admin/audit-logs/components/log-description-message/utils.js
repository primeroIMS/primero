// Copyright (c) 2014 UNICEF. All rights reserved.

import { ACTIONS_WITH_RECORD_ID } from "./constants";

/* eslint-disable import/prefer-default-export */
export const getRecordID = dataRecord => {
  const recordID = dataRecord.get("record_id") || "";
  const action = dataRecord.get("action");

  return recordID && ACTIONS_WITH_RECORD_ID.includes(action) ? recordID : "";
};
