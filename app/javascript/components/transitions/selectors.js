import { List } from "immutable";
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
        (isReferral
          ? f.type === capitalizedReferral
          : f.type !== capitalizedReferral)
    );

  return transitions.size ? transitions : List([]);
};
