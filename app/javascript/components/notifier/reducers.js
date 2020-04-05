import { List } from "immutable";

import NAMESPACE from "./namespace";
import { ENQUEUE_SNACKBAR, CLOSE_SNACKBAR, REMOVE_SNACKBAR } from "./actions";
import { MessageRecord } from "./records";

const DEFAULT_STATE = List([]);

export const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case ENQUEUE_SNACKBAR:
      if (payload.message || payload.messageKey) {
        return state.update(a => a.push(MessageRecord(payload)));
      }

      return state;
    case CLOSE_SNACKBAR:
      return state.update(m =>
        m.map(n =>
          n.options.key === payload.key
            ? MessageRecord(n).merge({ dismissed: true })
            : MessageRecord(n)
        )
      );
    case REMOVE_SNACKBAR:
      return state.filter(message => message.options.key !== payload.key);
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
