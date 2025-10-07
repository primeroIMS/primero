// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */
import actions from "./actions";
import { PER_PAGE, FIRST_PAGE_RESULTS } from "./constants";

export const fetchChangeLogs = (recordType, record, page = FIRST_PAGE_RESULTS, selectedFilters = {}) => ({
  type: actions.FETCH_CHANGE_LOGS,
  api: {
    path: `${recordType}/${record}/record_history`,
    params: { per: PER_PAGE, page, filters: selectedFilters }
  }
});
