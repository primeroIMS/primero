import { fromJS } from "immutable";

import actions from "./actions";

const DEFAULT_STATE = fromJS({ saving: false, errors: false });

const reducer = (state = DEFAULT_STATE, { type }) => {
  switch (type) {
    case actions.SAVE_INTAKE_RECORD_STARTED:
      return state.set("saving", true).set("errors", false);
    case actions.SAVE_INTAKE_RECORD_SUCCESS:
      return state.set("saving", false).set("errors", false);
    case actions.SAVE_INTAKE_RECORD_FAILURE:
      return state.set("saving", false).set("errors", true);
    default:
      return state;
  }
};

export default { intake: reducer };
