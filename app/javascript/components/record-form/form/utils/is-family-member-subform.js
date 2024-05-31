// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { FAMILY_MEMBERS_SUBFORM_ID, RECORD_TYPES } from "../../../../config/constants";

export default (recordType, uniqueId) =>
  RECORD_TYPES[recordType] === RECORD_TYPES.families && uniqueId === FAMILY_MEMBERS_SUBFORM_ID;
