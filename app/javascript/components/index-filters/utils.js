import { fromJS } from "immutable";
import isEmpty from "lodash/isEmpty";
import isObject from "lodash/isObject";
import omit from "lodash/omit";

import { APPROVALS, APPROVALS_TYPES, VIOLATION_TYPE } from "../../config";

import { FILTER_TYPES, MY_CASES_FILTER_NAME, OR_FILTER_NAME } from "./constants";
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

export const isDateFieldFromValue = (field, keys, locale) => {
  if (field.type !== "dates") {
    return false;
  }

  const datesOption = field?.options?.[locale];

  if (!datesOption) {
    return false;
  }

  return datesOption?.filter(dateOption => keys.includes(dateOption.id))?.length > 0;
};

export const showMyCasesFilter = (field, keys) =>
  field.field_name === MY_CASES_FILTER_NAME && keys.includes(OR_FILTER_NAME);

export const calculateFilters = ({
  defaultFilters,
  primaryFilters,
  defaultFilterNames,
  filters,
  locale,
  more,
  moreSectionKeys,
  queryParamsKeys
}) => {
  const selectedFromMoreSection = filters.filter(
    filter =>
      moreSectionKeys.includes(filter.field_name) ||
      showMyCasesFilter(filter, moreSectionKeys) ||
      isDateFieldFromValue(filter, moreSectionKeys, locale)
  );

  const queryParamsFilter = filters.filter(
    filter =>
      !more &&
      (queryParamsKeys.includes(filter.field_name) ||
        showMyCasesFilter(filter, queryParamsKeys) ||
        isDateFieldFromValue(filter, queryParamsKeys, locale)) &&
      !(
        defaultFilterNames.includes(filter.field_name) ||
        primaryFilters.map(t => t.field_name).includes(filter.field_name)
      )
  );

  return fromJS([
    ...primaryFilters,
    ...defaultFilters,
    ...queryParamsFilter,
    ...(!more ? selectedFromMoreSection : [])
  ]);
}

export const combineFilters = data => {
  if (data.violation_category && data.verification_status) {
    const combinedFilters = data.violation_category.reduce((acc, violationCategory) => {
      const combined = data.verification_status.map(verificationStatus => `${violationCategory}_${verificationStatus}`);

      return [...acc, ...combined];
    }, []);

    return {
      ...omit(data, ["verification_status", "violation_category"]),
      violation_with_verification_status: combinedFilters
    };
  }

  return data;
};

export const splitFilters = data => {
  const violationTypes = Object.values(VIOLATION_TYPE);
  const violationWithVerificationStatus = data.violation_with_verification_status;

  if (violationWithVerificationStatus) {
    const splittedFilters = violationWithVerificationStatus.reduce(
      (acc, elem) => {
        const violationCategory = violationTypes.find(violationType => elem.startsWith(violationType));

        if (violationCategory) {
          const verificationStatus = elem.replace(`${violationCategory}_`, "");

          if (verificationStatus) {
            if (!acc.violation_category.includes(violationCategory)) {
              acc.violation_category = [...acc.violation_category, violationCategory];
            }

            if (!acc.verification_status.includes(verificationStatus)) {
              acc.verification_status = [...acc.verification_status, verificationStatus];
            }
          }
        }

        return acc;
      },
      { violation_category: [], verification_status: [] }
    );

    return { ...omit(data, "violation_with_verification_status"), ...splittedFilters };
  }

  return data;
};
