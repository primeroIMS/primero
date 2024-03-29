// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */

import { Record } from "immutable";

export const SavedSearchesRecord = Record({
  id: null,
  name: "",
  record_type: null,
  user_id: null,
  message: "",
  filters: []
});
