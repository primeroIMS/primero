// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */
import { batch } from "react-redux";
import { subDays, startOfDay } from "date-fns";

import { FILTER_TYPES } from "../../../index-filters";
import { RECORD_TYPES_PLURAL } from "../../../../config";
import { toServerDateFormat } from "../../../../libs";
import { getDateValue } from "../../../index-filters/components/filter-types/date-filter/utils";

import { FILTER_NAMES, FIRST_PAGE_RESULTS, TIMESTAMP, ACTIONS, DAYS_AGO } from "./constants";

export const getFilters = i18n => [
  {
    name: "access_log.filters.actions",
    field_name: FILTER_NAMES.actions,
    type: FILTER_TYPES.MULTI_SELECT,
    option_strings_source: null,
    multiple: true,
    options: ACTIONS.map(action => ({ id: action, display_text: i18n.t(`access_log.filters.${action}`) })),
    mode: {
      defaultFilter: true
    }
  },
  {
    name: "access_log.filters.timestamp",
    field_name: FILTER_NAMES.timestamp,
    type: FILTER_TYPES.DATES,
    option_strings_source: null,
    dateIncludeTime: true,
    options: {
      [i18n.locale]: [{ id: TIMESTAMP, display_name: i18n.t("logger.timestamp") }]
    }
  }
];

export function onSubmitFn({ filters, dispatch, fetchFn, setFormFilters, recordId, recordType }) {
  batch(() => {
    dispatch(fetchFn(RECORD_TYPES_PLURAL[recordType], recordId, FIRST_PAGE_RESULTS, filters));
    dispatch(setFormFilters(filters));
  });
}

export function defaultDateValues() {
  return {
    from: toServerDateFormat(startOfDay(subDays(new Date(), DAYS_AGO), { includeTime: true, normalize: true })),
    to: getDateValue("to", null, true)
  };
}
