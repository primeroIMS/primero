import isEmpty from "lodash/isEmpty";
import isObject from "lodash/isObject";

import { APPROVALS, APPROVALS_TYPES, VIOLATION_TYPE } from "../../config";

import { FILTER_TYPES } from "./constants";
import {
  CheckboxFilter,
  ChipsFilter,
  SwitchFilter,
  DateFilter,
  ToggleFilter,
  SelectFilter
} from "./components/filter-types";

export const filterType = type => {
  switch (type) {
    case FILTER_TYPES.CHECKBOX:
      return CheckboxFilter;
    case FILTER_TYPES.TOGGLE:
      return SwitchFilter;
    case FILTER_TYPES.MULTI_TOGGLE:
      return ToggleFilter;
    case FILTER_TYPES.DATES:
      return DateFilter;
    case FILTER_TYPES.CHIPS:
      return ChipsFilter;
    case FILTER_TYPES.MULTI_SELECT:
      return SelectFilter;
    default:
      return null;
  }
};

export const compactFilters = values =>
  Object.keys(values).reduce((prev, current) => {
    const obj = prev;
    const value = values[current];

    if ((Array.isArray(value) || isObject(value)) && isEmpty(value)) {
      return obj;
    }

    if (value) {
      obj[current] = values[current];
    }

    return obj;
  }, {});

export const buildNameFilter = (item, i18n, approvalsLabels) => {
  switch (item) {
    case `${APPROVALS}.${APPROVALS_TYPES.assessment}`:
      return approvalsLabels.get("assessment");
    case `${APPROVALS}.${APPROVALS_TYPES.case_plan}`:
      return approvalsLabels.get("case_plan");
    case `${APPROVALS}.${APPROVALS_TYPES.closure}`:
      return approvalsLabels.get("closure");
    case `${APPROVALS}.${APPROVALS_TYPES.action_plan}`:
      return approvalsLabels.get("action_plan");
    case `${APPROVALS}.${APPROVALS_TYPES.gbv_closure}`:
      return approvalsLabels.get("gbv_closure");
    default:
      return i18n.t(item);
  }
};

export const combineFilters = data => {
  if (data.violation_category && data.verification_status) {
    const combinedFilters = data.violation_category.reduce((acc, violationCategory) => {
      const filterCombinations = data.verification_status.reduce((acc2, verificationStatus) => {
        return { ...acc2, [`${violationCategory}_${verificationStatus}`]: ["true"] };
      }, {});

      return { ...acc, ...filterCombinations };
    }, {});

    const combined = { ...data, ...combinedFilters };

    delete combined.verification_status;
    delete combined.violation_category;

    return combined;
  }

  return data;
};

export const splitFilters = data => {
  const violationTypes = Object.values(VIOLATION_TYPE);

  return Object.entries(data).reduce((acc, [key, value]) => {
    const violationCategory = violationTypes.find(violationType => key.startsWith(violationType));

    if (violationCategory) {
      const verificationStatus = key.replace(`${violationCategory}_`, "");

      if (verificationStatus) {
        const violationCategories = isEmpty(acc.violation_category) ? [] : acc.violation_category;

        if (!violationCategories.includes(violationCategory)) {
          violationCategories.push(violationCategory);
        }

        const verificationStatuses = isEmpty(acc.verification_status) ? [] : acc.verification_status;

        if (!verificationStatuses.includes(verificationStatus)) {
          verificationStatuses.push(verificationStatus);
        }

        return { ...acc, violation_category: violationCategories, verification_status: verificationStatuses };
      }
    }

    return { ...acc, [key]: value };
  }, {});
};
