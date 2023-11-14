// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { isEqual } from "lodash";
import { memo } from "react";

export default Component => memo(Component, (prev, next) => isEqual(prev, next));
