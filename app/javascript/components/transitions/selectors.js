import { fromJS, List } from "immutable";
import upperFirst from "lodash/upperFirst";

import { RECORD_TYPES, REFERRAL } from "../../config";

import NAMESPACE from "./namespace";

export const selectTransitions = (state, recordType, id, isReferral) => {
  const capitalizedReferral = upperFirst(REFERRAL);
  const type = RECORD_TYPES[recordType];
  const transitions = state
    .getIn(["records", NAMESPACE, "data"])
    .filter(
      f =>
        f.record_type === type &&
        f.record_id === id &&
        (isReferral ? f.type === capitalizedReferral : f.type !== capitalizedReferral)
    );

  return transitions.size ? transitions : List([]);
};

export const selectTransitionByTypeAndStatus = (state, transitionTypes, status) =>
  state
    .getIn(["records", NAMESPACE, "data"], List([]))
    .filter(transition => transitionTypes.includes(transition.type) && transition.status === status);

export const getTransitionById = (state, id) =>
  state.getIn(["records", NAMESPACE, "data"], fromJS([])).find(transition => transition.id === id);
