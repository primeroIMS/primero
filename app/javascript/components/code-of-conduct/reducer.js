import { fromJS } from "immutable";

import actions from "./actions";

const DEFAULT_STATE = fromJS({});

export default (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.ACCEPT_CODE_OF_CONDUCT_STARTED:
      return state.set("updatingCodeOfConduct", true);
    case actions.ACCEPT_CODE_OF_CONDUCT_SUCCESS:
      // eslint-disable-next-line camelcase
      return state.set("updatingCodeOfConduct", false).set("codeOfConductId", payload?.data?.code_of_conduct_id);
    default:
      return state;
  }
};
