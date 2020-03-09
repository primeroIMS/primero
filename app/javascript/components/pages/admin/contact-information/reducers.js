import { fromJS } from "immutable";

import { ContactInformationRecord } from "../../support/records";

import actions from "./actions";

const DEFAULT_STATE = fromJS({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.SAVE_CONTACT_INFORMATION_SUCCESS:
      return state.setIn(
        ["data"],
        ContactInformationRecord(fromJS(payload.data))
      );
    default:
      return state;
  }
};

export const reducers = reducer;
