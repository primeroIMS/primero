// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { REPORTABLE_TYPES } from "../constants";

export default selectedRecordType =>
  /(\w*reportable\w*)$/.test(selectedRecordType) ? REPORTABLE_TYPES[selectedRecordType] : "";
