// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { MY_CASES_FILTER_NAME, OR_FILTER_NAME } from "../constants";

export default (field, keys) => field.field_name === MY_CASES_FILTER_NAME && keys.includes(OR_FILTER_NAME);
