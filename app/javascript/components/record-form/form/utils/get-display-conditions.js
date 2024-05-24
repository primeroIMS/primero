// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import omit from "lodash/omit";

export default displayConditions => omit(displayConditions, ["disabled"]);
