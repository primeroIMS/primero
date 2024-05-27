// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { APPROVAL_STATUS } from "../request-approval/constants";

export default record =>
  (record?.get("approval_subforms") || fromJS([])).reduce((acc, subform) => {
    const requestedFor = subform.get("approval_requested_for");

    if (subform.get("approval_status") === APPROVAL_STATUS.requested && !acc.includes(requestedFor)) {
      return acc.concat(requestedFor);
    }

    return acc;
  }, []);
