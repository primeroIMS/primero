/* eslint-disable import/prefer-default-export */

export const getSavingRecord = state =>
  state.getIn(["records", "admin", "forms", "saving"], false);
