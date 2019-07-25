import { List } from "immutable";
import NAMESPACE from "./namespace";
import * as Actions from "./actions";
import { MessageRecord } from "./records";

const DEFAULT_STATE = List([]);

export const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.ENQUEUE_SNACKBAR:
      return state.update(a => a.push(MessageRecord(payload)));
    case Actions.CLOSE_SNACKBAR:
      return state.update(m =>
        m.map(n =>
          n.options.key === payload.key
            ? MessageRecord(n).merge({ dismissed: true })
            : MessageRecord(n)
        )
      );
    case Actions.REMOVE_SNACKBAR:
      return state.filter(m => m.options.key !== payload.key);
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
