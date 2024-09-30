// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { ACTIONS, RESOURCES } from "../../../permissions";

const userHasPermission = (userPermissions, resource, action) =>
  userPermissions
    .get(resource, fromJS([]))
    .filter(resourceAction => action.includes(resourceAction))
    .isEmpty() === false;

const isPermittedIndicator = (userPermissions, indicatorName) => {
  const indicators = {
    shared_with_me_total_referrals: [RESOURCES.cases, [ACTIONS.RECEIVE_REFERRAL, ACTIONS.MANAGE]],
    shared_with_me_new_referrals: [RESOURCES.cases, [ACTIONS.RECEIVE_REFERRAL, ACTIONS.MANAGE]],
    shared_with_me_transfers_awaiting_acceptance: [RESOURCES.cases, [ACTIONS.RECEIVE_TRANSFER, ACTIONS.MANAGE]]
  };

  const [resource, action] = indicators[indicatorName];

  if (resource && action) {
    return userHasPermission(userPermissions, resource, action);
  }

  return false;
};

export default (sharedWithMeDashboard, userPermissions) => {
  const permittedIndicators = sharedWithMeDashboard
    .get("indicators", fromJS({}))
    .filter((_value, key) => isPermittedIndicator(userPermissions, key));

  return fromJS({
    indicators: permittedIndicators
  });
};
