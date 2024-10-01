// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { Record } from "immutable";

export const ListHeaderRecord = Record({
  name: null,
  field_name: null,
  id_search: false
});

export const PermissionRecord = Record({
  resource: null,
  actions: []
});

export const FilterRecord = Record({
  name: null,
  unique_id: null,
  field_name: null,
  option_strings_source: null,
  options: [],
  type: null,
  sort_options: false,
  toggle_include_disabled: false
});
