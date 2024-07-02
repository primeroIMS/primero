// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { FAMILY_DETAILS_SUBFORM_ID, RECORD_TYPES } from "../../../../config";

export default (recordType, uniqueId) =>
  RECORD_TYPES[recordType] === RECORD_TYPES.cases && uniqueId === FAMILY_DETAILS_SUBFORM_ID;
