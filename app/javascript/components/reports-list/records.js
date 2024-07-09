// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */

import { Record } from "immutable";

export const ReportRecord = Record({
  id: "",
  name: "",
  description: "",
  graph: false,
  graph_type: "",
  fields: []
});
