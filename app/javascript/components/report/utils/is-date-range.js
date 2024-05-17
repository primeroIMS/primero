// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { DATE_PATTERN } from "../constants";

export default date => date.match(new RegExp(`^${DATE_PATTERN} - ${DATE_PATTERN}$`));
