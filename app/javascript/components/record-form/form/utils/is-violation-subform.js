// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { RECORD_TYPES, VIOLATIONS_FORM, VIOLATIONS_SUBFORM_UNIQUE_IDS } from "../../../../config";

export default (recordType, uniqueId, useSubformUniqueId = false) => {
  const uniqueIds = useSubformUniqueId ? VIOLATIONS_SUBFORM_UNIQUE_IDS : VIOLATIONS_FORM;

  return RECORD_TYPES[recordType] === RECORD_TYPES.incidents && uniqueIds.includes(uniqueId);
};
