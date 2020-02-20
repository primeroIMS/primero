import { fromJS } from "immutable";

import { mergeRecord } from "../../../../libs";

import actions from "./actions";

const DEFAULT_STATE = fromJS({ data: [] });

export const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.REVOKE_TRANSITION_SUCCESS: {
      let newState = state;
      const transitionData = state.getIn(["transitions", "data"]);
      const { data } = payload;

      delete data.record;
      const transitionIndex = transitionData.findIndex(
        r => r.get("id") === data.id
      );

      if (transitionIndex !== -1) {
        newState = state.updateIn(["transitions", "data", transitionIndex], u =>
          mergeRecord(u, fromJS(data))
        );
      } else {
        newState = state.updateIn(["transitions", "data"], u => {
          return u.push(fromJS(data));
        });
      }

      return newState;
    }
    default:
      return state;
  }
};
