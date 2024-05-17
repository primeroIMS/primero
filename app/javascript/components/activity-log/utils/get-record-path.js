// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { CASE, INCIDENT, RECORD_TYPES_PLURAL, TRACING_REQUEST } from "../../../config";

export default record => {
  const PLURAL_TYPE_MAPPING = Object.freeze({
    [CASE]: RECORD_TYPES_PLURAL.case,
    child: RECORD_TYPES_PLURAL.case,
    [INCIDENT]: RECORD_TYPES_PLURAL.incident,
    [TRACING_REQUEST]: RECORD_TYPES_PLURAL.tracing_request
  });

  const loweredRecordType = record.get("record_type").toLowerCase();

  return `${PLURAL_TYPE_MAPPING[loweredRecordType] || loweredRecordType}/${record.get("record_id")}`;
};
