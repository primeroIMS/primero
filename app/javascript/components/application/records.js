// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */

import { fromJS, Record } from "immutable";

export const PrimeroModuleRecord = Record({
  unique_id: "",
  name: "",
  associated_record_types: [],
  options: {},
  workflows: {},
  field_map: fromJS([]),
  list_filters: fromJS([]),
  list_headers: fromJS([]),
  primary_age_range: null,
  approvals_labels: null,
  age_ranges: null
});
