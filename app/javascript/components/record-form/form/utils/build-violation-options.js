// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import isEmpty from "lodash/isEmpty";

import { getShortIdFromUniqueId } from "../../../records/utils";
import { VIOLATIONS_SUBFORM_UNIQUE_IDS } from "../../../../config";

const getViolationValues = (values, violationName) => {
  if (isEmpty(values)) {
    return [];
  }

  return values.reduce((acc, curr) => {
    if (acc.map(elem => elem.id).includes(curr.unique_id)) return acc;

    const shortUniqueID = getShortIdFromUniqueId(curr.unique_id);

    if (!shortUniqueID) return acc;

    return [...acc, { id: curr.unique_id, display_text: `${violationName} - ${shortUniqueID}`, disabled: false }];
  }, []);
};

export default (values, fieldName, violationName, isViolation, i18n, uniqueId) => {
  if (isEmpty(values)) {
    return [];
  }

  if (isViolation) {
    return getViolationValues([...values[fieldName], { unique_id: uniqueId }], violationName);
  }

  return VIOLATIONS_SUBFORM_UNIQUE_IDS.reduce((acc, curr) => {
    const currentValues = getViolationValues(values[curr], i18n.t(`incident.violation.types.${curr}`));

    return [...acc, ...currentValues];
  }, []);
};
