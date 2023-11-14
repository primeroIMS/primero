// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { AGE_MAX } from "../../../config";

export default data => data.map(elem => elem.replace(/\../g, " - ").replace(` - ${AGE_MAX}`, "+"));
