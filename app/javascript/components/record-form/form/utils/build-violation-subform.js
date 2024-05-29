// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import merge from "deepmerge";

import subformAwareMerge from "../../../../db/utils/subform-aware-merge";
import { compactBlank } from "../../utils";

export default (formikValues, currentValues) => {
  const initialValuesReduce = [...formikValues];

  return currentValues.reduce((acc, curr) => {
    const subformIndex = acc.findIndex(subform => subform.unique_id === curr.unique_id);

    if (subformIndex === -1) {
      return [...acc, compactBlank(curr)];
    }

    acc[subformIndex] = merge(acc[subformIndex], compactBlank(curr), { arrayMerge: subformAwareMerge });

    return acc;
  }, initialValuesReduce);
};
