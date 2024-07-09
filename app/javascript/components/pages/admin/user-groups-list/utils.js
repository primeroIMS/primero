// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */

import { OPTION_TYPES } from "../../../form";
import { FILTER_TYPES } from "../../../index-filters";
import { getFilters } from "../utils";

import { AGENCY_UNIQUE_IDS } from "./constants";

// eslint-disable-next-line import/prefer-default-export
export const getUserGroupFilters = i18n => [
  ...getFilters(i18n),
  {
    name: "cases.filter_by.agency",
    field_name: AGENCY_UNIQUE_IDS,
    option_strings_source: OPTION_TYPES.AGENCY,
    option_strings_source_id_key: "unique_id",
    type: FILTER_TYPES.MULTI_SELECT,
    multiple: true
  }
];
