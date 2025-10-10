// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import actions from "./actions";

const DEFAULT_STATE = fromJS({});

export default (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.ACCEPT_TERMS_OF_USE_STARTED:
      return state.set("updatingTermsOfUse", true);
    case actions.ACCEPT_TERMS_OF_USE_SUCCESS: {
      const { data } = payload;

      return state.set("updatingTermsOfUse", false).set("termsOfUseAcceptedOn", data?.terms_of_use_accepted_on);
    }
    case actions.ACCEPT_TERMS_OF_USE_FAILURE:
      return state.set("updatingTermsOfUse", false);
    default:
      return state;
  }
};
