/* eslint-disable camelcase */

import { fromJS } from "immutable";

import actions from "./actions";

const DEFAULT_STATE = fromJS({});

export default (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.ACCEPT_CODE_OF_CONDUCT_STARTED:
      return state.set("updatingCodeOfConduct", true);
    case actions.ACCEPT_CODE_OF_CONDUCT_SUCCESS: {
      const { data } = payload;

      return state
        .set("updatingCodeOfConduct", false)
        .set("codeOfConductId", data?.code_of_conduct_id)
        .set("codeOfConductAcceptedOn", data?.code_of_conduct_accepted_on);
    }
    default:
      return state;
  }
};
