// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

// eslint-disable-next-line import/prefer-default-export
export const getReferralSuccess = state => state.getIn(["records", "transitions", "referral", "success"], false);
