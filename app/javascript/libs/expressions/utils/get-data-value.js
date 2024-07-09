// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { isImmutable } from "immutable";

export default (key, data) => (isImmutable(data) ? data.get(key) : data[key]);
