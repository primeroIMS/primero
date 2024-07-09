// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */

import { fromJS } from "immutable";

import { VIOLATION_TYPE, VIOLATION_VERIFICATION_STATUS } from "../../../../../config";

export const transformToPivotedDashboard = data => {
  const violationTypeIds = Object.values(VIOLATION_TYPE);
  const verificationStatusIds = Object.values(VIOLATION_VERIFICATION_STATUS);

  return fromJS({
    name: "dashboard.dash_violations_category_verification_status",
    type: "indicator",
    indicators: {
      violations_category_verification_status: {
        ...violationTypeIds.reduce((acc1, violationTypeId) => {
          return {
            ...acc1,
            [violationTypeId]: verificationStatusIds.reduce((acc2, statusId) => {
              return {
                ...acc2,
                [statusId]: {
                  count: data.getIn(
                    [
                      "indicators",
                      "violations_category_verification_status",
                      `${violationTypeId}_${statusId}`,
                      "count"
                    ],
                    0
                  ),
                  query: data.getIn(
                    [
                      "indicators",
                      "violations_category_verification_status",
                      `${violationTypeId}_${statusId}`,
                      "query"
                    ],
                    []
                  )
                }
              };
            }, {})
          };
        }, {})
      }
    }
  });
};
