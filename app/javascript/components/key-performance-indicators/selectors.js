// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import NAMESPACE from "./namespace";

export default (identifier, state, _default) => {
  return state.getIn(["records", NAMESPACE, identifier], fromJS(_default));
};
