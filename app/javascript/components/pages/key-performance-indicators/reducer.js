import { fromJS, Map } from "immutable";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = Map({});

// TODO: Lots of strings here with no warn of spelling mistakes. We should
// move these over to a core set of defined strings with language features
// that will warn us when they are wrong.

const reducer = (state = DEFAULT_STATE, { type, payload }) => {

  if (!type.startsWith('KeyPerformanceIndicators'))
    return state;

  if (!type.endsWith('SUCCESS'))
    return state;

  let identifier = type.match(/KeyPerformanceIndicators\/([a-z_]*?)_SUCCESS/)?.[1];

  if (identifier) {
    return state.set(identifier, fromJS(payload));
  }

  return state;
};

export const reducer = { [NAMESPACE]: reducer };
