// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */

import { fromJS } from "immutable";

import NAMESPACE from "./namespace";

export const getReport = state => {
  return state.getIn(["records", NAMESPACE, "selectedReport"], fromJS({}));
};
