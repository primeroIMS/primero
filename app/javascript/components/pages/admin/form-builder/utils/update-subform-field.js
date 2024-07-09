// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { NESTED_DATA_FIELDS } from "../constants";

export default (field, fieldUpdate) => {
  const fieldRemoved = NESTED_DATA_FIELDS.reduce((acc, elem) => {
    if (field.get(elem)?.size > 0) {
      return acc.remove(elem);
    }

    return acc;
  }, field);

  const updateRemoved = NESTED_DATA_FIELDS.reduce((acc, elem) => {
    if (acc.get(elem)?.size > 0) {
      return acc.remove(elem);
    }

    return acc;
  }, fieldUpdate);

  const updated = NESTED_DATA_FIELDS.reduce((acc, elem) => {
    if (fieldUpdate.get(elem)?.size > 0) {
      return acc.set(elem, fieldUpdate.get(elem));
    }

    return acc;
  }, fieldRemoved);

  return updated.mergeDeep(updateRemoved);
};
