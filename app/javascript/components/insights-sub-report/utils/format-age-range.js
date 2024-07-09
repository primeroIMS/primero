// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { AGE_MAX } from "../../../config";

export default range => range.replace(/\../g, " - ").replace(` - ${AGE_MAX}`, "+");
