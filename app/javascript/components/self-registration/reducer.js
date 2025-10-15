// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import actions from "./actions";
import { NAMESPACE } from "./constants";

const DEFAULT_STATE = fromJS({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.REGISTER_STARTED:
      return state.set("error", null);
    case actions.REGISTER_FAILURE:
      return state.set("error", payload.error);
    default:
      return state;
  }
};

export default { [NAMESPACE]: reducer };
