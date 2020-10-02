// eslint-disable-next-line import/prefer-default-export
export const getReferralSuccess = state => state.getIn(["records", "transitions", "referral", "success"], false);
