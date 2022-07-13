/* eslint-disable import/prefer-default-export */

import { fromJS } from "immutable";

import { VIOLATION_TYPE } from "../../../../../config";

export const getVerifiedData = data => {
  const violationTypeIds = Object.values(VIOLATION_TYPE);

  return fromJS({
    name: data.get("name"),
    type: data.get("type"),
    indicators: {
      violations_category_region: data
        .getIn(["indicators", "violations_category_region"], fromJS({}))
        .entrySeq()
        .reduce((acc, [key, value]) => {
          violationTypeIds.forEach(type => {
            acc[key] = { ...acc[key], [type]: value.get(`${type}_verified`) };
          });

          return acc;
        }, {})
    }
  });
};
