/* eslint-disable import/prefer-default-export */

import NAMESPACE from "../forms-list/namespace";

export const getSavingRecord = state =>
  state.getIn(["records", "admin", NAMESPACE, "saving"], false);
