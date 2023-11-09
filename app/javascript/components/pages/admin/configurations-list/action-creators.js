// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */

import { RECORD_PATH } from "../../../../config";

import actions from "./actions";

export const fetchConfigurations = params => {
  const { data } = params || {};
  data.per = 5;

  return {
    type: actions.FETCH_CONFIGURATIONS,
    api: {
      path: RECORD_PATH.configurations,
      params: data
    }
  };
};
