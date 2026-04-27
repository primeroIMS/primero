/* eslint-disable import/prefer-default-export */

export const selectUpdatingTermsOfUse = state => state.getIn(["user", "updatingTermsOfUse"], null);
