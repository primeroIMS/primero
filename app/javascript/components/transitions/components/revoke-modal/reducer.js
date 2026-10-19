import { fromJS } from "immutable";

import { mergeRecord } from "../../../../libs";
import { TransitionRecord } from "../../records";

import actions from "./actions";

const DEFAULT_STATE = fromJS({ data: [] });

export default (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.REVOKE_TRANSITION_SUCCESS: {
      let newState = state;
      const { data } = payload;

      delete data.record;
      const transitionIndex = state.getIn(["transitions", "data"]).findIndex(r => r.get("id") === data.id);

      if (transitionIndex !== -1) {
        newState = state.updateIn(["transitions", "data", transitionIndex], u =>
          mergeRecord(u, TransitionRecord(data))
        );
      } else {
        newState = state.updateIn(["transitions", "data"], u => {
          return u.push(TransitionRecord(data));
        });
      }

      return newState;
    }
    default:
      return state;
  }
};
