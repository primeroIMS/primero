// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { get } from "../components/form/utils/get";

const OWNED_BY = "owned_by";
const OWNED_BY_FULL_NAME = "owned_by_full_name";
const ASSOCIATED_USER_NAMES = "associated_user_names";

const DEFAULT_MAPPINGS = [OWNED_BY, OWNED_BY_FULL_NAME, ASSOCIATED_USER_NAMES].map(field => ({
  source: field,
  target: field
}));

export default (record, fieldMap = []) => {
  const fieldMapWithDefaults = [...fieldMap, ...DEFAULT_MAPPINGS];

  return fieldMapWithDefaults.reduce((prev, { source, target }) => {
    return { ...prev, [target]: get(record, source) };
  }, {});
};
